import { NextResponse } from 'next/server'
import { verifyGoogleIdToken } from '@/lib/auth/google'
import { applySessionCookie, toSessionUser } from '@/lib/auth/session'
import { getDashboardPath } from '@/lib/auth/routing'
import { UserStore } from '@/lib/userStore'
import { sendWelcomeEmail } from '@/lib/welcomeEmailService'
import { AuthEventStore } from '@/lib/authEventStore'

export const runtime = 'nodejs'

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

function appBaseUrl() {
  return requiredEnv('APP_BASE_URL').replace(/\/+$/g, '')
}

function parseEmailList(value: string | undefined) {
  return new Set(
    (value || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean),
  )
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const error = url.searchParams.get('error')
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url))
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url))
  }

  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map(v => v.trim())
      .filter(Boolean)
      .map(v => {
        const idx = v.indexOf('=')
        if (idx === -1) return [v, '']
        return [decodeURIComponent(v.slice(0, idx)), decodeURIComponent(v.slice(idx + 1))]
      }),
  )

  const expectedState = cookies['g_oauth_state']
  const nonce = cookies['g_oauth_nonce']
  const verifier = cookies['g_oauth_verifier']
  const nextPath = cookies['g_oauth_next']

  if (!expectedState || !nonce || !verifier) {
    return NextResponse.redirect(new URL('/login?error=missing_state', request.url))
  }
  if (state !== expectedState) {
    return NextResponse.redirect(new URL('/login?error=state_mismatch', request.url))
  }

  try {
    const googleClientId = requiredEnv('GOOGLE_CLIENT_ID')
    const googleClientSecret = requiredEnv('GOOGLE_CLIENT_SECRET')
    const redirectUri = `${appBaseUrl()}/api/auth/google/callback`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url))
    }

    const tokenJson: any = await tokenRes.json()
    const idToken = tokenJson.id_token
    if (typeof idToken !== 'string' || !idToken) {
      return NextResponse.redirect(new URL('/login?error=missing_id_token', request.url))
    }

    const profile = await verifyGoogleIdToken({ idToken, clientId: googleClientId, nonce })

    const adminEmails = parseEmailList(process.env.AUTH_ADMIN_EMAILS)
    const vendorEmails = parseEmailList(process.env.AUTH_VENDOR_EMAILS)
    const emailLower = profile.email.toLowerCase()

    const role = adminEmails.has(emailLower)
      ? 'admin'
      : vendorEmails.has(emailLower)
        ? 'vendor'
        : 'customer'

    const existingUser = UserStore.findByEmail(profile.email)
    const isNewUser = !existingUser

    const storedUser = UserStore.upsertGoogleUser({
      id: profile.sub,
      email: profile.email,
      name: profile.name,
      role,
      ...(profile.picture ? { picture: profile.picture } : {}),
    })

    AuthEventStore.record({
      type: isNewUser ? 'signup' : 'login',
      userId: storedUser.id,
      email: storedUser.email,
      name: storedUser.name,
      provider: 'google',
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    sendWelcomeEmail({ to: storedUser.email, name: storedUser.name, isNewUser }).catch(() => {})

    const destination = nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : getDashboardPath(storedUser.role)
    const response = NextResponse.redirect(new URL(destination, request.url))
    const secure = process.env.NODE_ENV === 'production'

    await applySessionCookie(response, toSessionUser(storedUser))

    // Clear one-time OAuth cookies (same path '/' used when setting)
    const clearOpts = { httpOnly: true, secure, sameSite: 'lax' as const, maxAge: 0, path: '/' }
    for (const name of ['g_oauth_state', 'g_oauth_nonce', 'g_oauth_verifier', 'g_oauth_next']) {
      response.cookies.set(name, '', clearOpts)
    }

    return response
  } catch {
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}

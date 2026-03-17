import { NextResponse } from 'next/server'
import { verifyGoogleIdToken } from '@/lib/auth/google'
import { signSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session'
import { FileStorage } from '@/lib/fileStorage'

export const runtime = 'nodejs'

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

function appBaseUrl() {
  const base = requiredEnv('APP_BASE_URL').replace(/\/+$/g, '')
  return base
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

  const expectedState = cookies.g_oauth_state
  const nonce = cookies.g_oauth_nonce
  const verifier = cookies.g_oauth_verifier
  const nextPath = cookies.g_oauth_next

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

    const user = {
      id: profile.sub,
      email: profile.email,
      name: profile.name,
      role,
      ...(profile.picture ? { picture: profile.picture } : {}),
    } as const

    try {
      FileStorage.init()
      FileStorage.users.save({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
    } catch {
      // ignore persistence failures (serverless/readonly FS)
    }

    const session = await signSession(user)

    const response = NextResponse.redirect(
      new URL(
        nextPath && nextPath.startsWith('/') ? nextPath : `/dashboard/${role}`,
        request.url,
      ),
    )
    const secure = process.env.NODE_ENV === 'production'

    response.cookies.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/',
    })

    // Clear one-time OAuth cookies
    for (const name of ['g_oauth_state', 'g_oauth_nonce', 'g_oauth_verifier', 'g_oauth_next']) {
      response.cookies.set(name, '', { httpOnly: true, secure, sameSite: 'lax', maxAge: 0, path: '/api/auth/google' })
    }

    return response
  } catch {
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}

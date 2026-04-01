import { NextResponse } from 'next/server'
import { randomUrlSafeString, pkceChallenge } from '@/lib/auth/google'

export const runtime = 'nodejs'

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

function appBaseUrl() {
  return requiredEnv('APP_BASE_URL').replace(/\/+$/g, '')
}

export async function GET(request: Request) {
  try {
    const googleClientId = requiredEnv('GOOGLE_CLIENT_ID')
    requiredEnv('GOOGLE_CLIENT_SECRET')
    if (!process.env.APP_SESSION_SECRET && !process.env.JWT_SECRET) {
      throw new Error('Missing APP_SESSION_SECRET (or legacy JWT_SECRET).')
    }

    const url = new URL(request.url)
    const next = url.searchParams.get('next') || '/'
    const safeNext = next.startsWith('/') ? next : '/'

    const state = randomUrlSafeString(24)
    const nonce = randomUrlSafeString(24)
    const verifier = randomUrlSafeString(48)
    const challenge = pkceChallenge(verifier)

    const redirectUri = `${appBaseUrl()}/api/auth/google/callback`
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', googleClientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'openid email profile')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('nonce', nonce)
    authUrl.searchParams.set('code_challenge', challenge)
    authUrl.searchParams.set('code_challenge_method', 'S256')

    const response = NextResponse.redirect(authUrl)
    const secure = process.env.NODE_ENV === 'production'

    // Use path '/' so cookies are accessible at /api/auth/google/callback
    const cookieOpts = { httpOnly: true, secure, sameSite: 'lax' as const, maxAge: 10 * 60, path: '/' }
    response.cookies.set('g_oauth_state', state, cookieOpts)
    response.cookies.set('g_oauth_nonce', nonce, cookieOpts)
    response.cookies.set('g_oauth_verifier', verifier, cookieOpts)
    response.cookies.set('g_oauth_next', safeNext, cookieOpts)

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Google auth is not configured', detail: error?.message || String(error) },
      { status: 500 },
    )
  }
}

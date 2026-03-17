import crypto from 'crypto'
import { createRemoteJWKSet, jwtVerify } from 'jose'

export type GoogleProfile = {
  sub: string
  email: string
  name: string
  picture?: string
}

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

function base64Url(input: Buffer) {
  return input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export function randomUrlSafeString(bytes: number) {
  return base64Url(crypto.randomBytes(bytes))
}

export function pkceChallenge(verifier: string) {
  const hash = crypto.createHash('sha256').update(verifier).digest()
  return base64Url(hash)
}

export async function verifyGoogleIdToken(opts: {
  idToken: string
  clientId: string
  nonce: string
}) {
  const { payload } = await jwtVerify(opts.idToken, GOOGLE_JWKS, {
    audience: opts.clientId,
    issuer: ['accounts.google.com', 'https://accounts.google.com'],
  })

  if (payload.nonce !== opts.nonce) {
    throw new Error('Nonce mismatch.')
  }

  const sub = typeof payload.sub === 'string' ? payload.sub : ''
  const email = typeof payload.email === 'string' ? payload.email : ''
  const name = typeof payload.name === 'string' ? payload.name : ''
  const picture = typeof payload.picture === 'string' ? payload.picture : undefined
  const emailVerified = payload.email_verified

  if (!sub || !email || !name) {
    throw new Error('Invalid ID token payload.')
  }
  if (emailVerified !== true) {
    throw new Error('Email not verified.')
  }

  const profile: GoogleProfile = { sub, email, name, ...(picture ? { picture } : {}) }
  return profile
}

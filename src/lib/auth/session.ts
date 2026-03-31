import { SignJWT, jwtVerify } from 'jose'
import type { NextResponse } from 'next/server'
import type { User } from '@/types'

export const SESSION_COOKIE_NAME = 'app_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export type SessionUser = Pick<User, 'id' | 'email' | 'name' | 'role'> & {
  picture?: string
  profilePhoto?: string
  phone?: string
  address?: string
}

export function toSessionUser(user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'picture' | 'profilePhoto' | 'phone' | 'address'>): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    picture: user.picture || user.profilePhoto || '',
    profilePhoto: user.profilePhoto || '',
    phone: user.phone || '',
    address: user.address || '',
  }
}

function getSessionSecret() {
  const raw = process.env.APP_SESSION_SECRET || process.env.JWT_SECRET
  if (!raw) {
    throw new Error('Missing APP_SESSION_SECRET (or legacy JWT_SECRET).')
  }
  return new TextEncoder().encode(raw)
}

export async function signSession(user: SessionUser) {
  const secret = getSessionSecret()
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    picture: user.picture || '',
    profilePhoto: user.profilePhoto || '',
    phone: user.phone || '',
    address: user.address || '',
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret)
}

export async function applySessionCookie(response: NextResponse, user: SessionUser) {
  const token = await signSession(user)

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function verifySession(token: string) {
  const secret = getSessionSecret()
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
  const role = payload.role
  if (role !== 'admin' && role !== 'vendor' && role !== 'customer') {
    throw new Error('Invalid session role.')
  }

  const user: SessionUser = {
    id: typeof payload.sub === 'string' ? payload.sub : '',
    email: typeof payload.email === 'string' ? payload.email : '',
    name: typeof payload.name === 'string' ? payload.name : '',
    role,
    ...(typeof payload.picture === 'string' && payload.picture ? { picture: payload.picture } : {}),
    ...(typeof payload.profilePhoto === 'string' && payload.profilePhoto ? { profilePhoto: payload.profilePhoto } : {}),
    ...(typeof payload.phone === 'string' && payload.phone ? { phone: payload.phone } : {}),
    ...(typeof payload.address === 'string' && payload.address ? { address: payload.address } : {}),
  }

  if (!user.id || !user.email) {
    throw new Error('Invalid session payload.')
  }

  return user
}

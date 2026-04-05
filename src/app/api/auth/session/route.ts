import { NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'
import { UserStore } from '@/lib/userStore'

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1] || '') : ''

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const sessionUser = await verifySession(token)
    const user = await UserStore.getPublicUser(sessionUser.id) || sessionUser
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}

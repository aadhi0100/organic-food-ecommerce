import { NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1] || '') : ''

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const user = await verifySession(token)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}


import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'

async function getSessionUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1] || '') : ''
  if (!token) return null
  try { return await verifySession(token) } catch { return null }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    const data = await request.json()
    const message = await db.messages.create({ ...data, userId: sessionUser.id })
    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    // Non-admins can only fetch their own messages
    const resolvedUserId = sessionUser.role === 'admin' ? (userId || undefined) : sessionUser.id
    const messages = resolvedUserId
      ? await db.messages.findByUserId(resolvedUserId)
      : await db.messages.findAll()
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

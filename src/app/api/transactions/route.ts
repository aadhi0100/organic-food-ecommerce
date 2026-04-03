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

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const orderId = searchParams.get('orderId')

    // Non-admins can only access their own transactions
    if (sessionUser.role !== 'admin') {
      const transactions = await db.transactions.findByUserId(sessionUser.id)
      return NextResponse.json(transactions)
    }

    let transactions
    if (userId) {
      transactions = await db.transactions.findByUserId(userId)
    } else if (orderId) {
      transactions = await db.transactions.findByOrderId(orderId)
    } else {
      transactions = await db.transactions.findAll()
    }

    return NextResponse.json(transactions)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

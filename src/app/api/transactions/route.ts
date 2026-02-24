import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const orderId = searchParams.get('orderId')
    
    let transactions
    if (userId) {
      transactions = await db.transactions.findByUserId(userId)
    } else if (orderId) {
      transactions = await db.transactions.findByOrderId(orderId)
    } else {
      transactions = await db.transactions.findAll()
    }
    
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const orderData = await request.json()
    const order = await db.orders.create(orderData)
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (userId) {
    const orders = await db.orders.findByUserId(userId)
    return NextResponse.json(orders)
  }
  
  const orders = await db.orders.findAll()
  return NextResponse.json(orders)
}

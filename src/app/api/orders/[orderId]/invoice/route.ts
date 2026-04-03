import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildInvoiceData } from '@/lib/invoiceData'

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const orders = await db.orders.getAll()
    const order = orders.find((o: any) => o.id === orderId)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const invoiceData = await buildInvoiceData(order)
    return NextResponse.json({ success: true, data: invoiceData })
  } catch (error) {
    console.error('Invoice data error:', error)
    return NextResponse.json(
      { error: 'Failed to load invoice data', details: String(error) },
      { status: 500 }
    )
  }
}

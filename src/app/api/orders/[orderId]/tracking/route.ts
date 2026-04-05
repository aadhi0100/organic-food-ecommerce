import { NextResponse } from 'next/server'
import { OrderStore } from '@/lib/orderStore'

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await context.params
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const trackingState = await OrderStore.getTrackingState(orderId)
    if (!trackingState) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      order: trackingState.order,
      tracking: trackingState.tracking,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load tracking data' }, { status: 500 })
  }
}

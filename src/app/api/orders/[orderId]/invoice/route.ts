import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateProfessionalInvoice } from '@/lib/professionalInvoice'

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

    // Get product details for items
    const itemsWithDetails = await Promise.all(
      order.items.map(async (item: any) => {
        const product = await db.products.findById(item.productId)
        const itemPrice = item.product?.price || item.price || product?.price || 0
        const itemName = item.product?.name || item.name || product?.name || 'Product'
        return {
          name: itemName,
          quantity: item.quantity || 1,
          price: itemPrice,
          total: itemPrice * (item.quantity || 1)
        }
      })
    )

    // Calculate totals from items
    const subtotal = itemsWithDetails.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.05
    const shipping = subtotal >= 500 ? 0 : 50
    const total = subtotal + tax + shipping

    const invoiceData = {
      orderId: order.id,
      orderDate: order.orderDate || order.createdAt || new Date().toISOString(),
      customerName: order.customerName || order.shippingAddress?.fullName || 'Customer',
      customerEmail: order.customerEmail || '',
      customerPhone: order.customerPhone || order.shippingAddress?.phone || '',
      shippingAddress: {
        street: order.shippingAddress?.street || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        zipCode: order.shippingAddress?.zipCode || '',
        country: order.shippingAddress?.country || 'India'
      },
      items: itemsWithDetails,
      subtotal,
      tax,
      shipping,
      total,
      deliveryDate: order.deliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      trackingNumber: order.trackingNumber || `TRK${order.id.slice(-8)}`,
      paymentMethod: order.paymentMethod || 'Cash on Delivery'
    }

    const pdfDoc = generateProfessionalInvoice(invoiceData)
    const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${orderId}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: String(error) }, 
      { status: 500 }
    )
  }
}

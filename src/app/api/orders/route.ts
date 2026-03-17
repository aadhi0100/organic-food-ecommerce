import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateProfessionalInvoice, calculateDeliveryDate, generateTrackingNumber } from '@/lib/professionalInvoice'
import { sendInvoiceEmail } from '@/lib/invoiceEmailService'

export async function POST(request: Request) {
  try {
    const orderData = await request.json()
    
    // Add delivery tracking info
    const trackingNumber = generateTrackingNumber()
    const deliveryDate = calculateDeliveryDate(orderData.orderDate || new Date().toISOString())
    
    const enhancedOrderData = {
      ...orderData,
      trackingNumber,
      deliveryDate,
      status: 'confirmed'
    }
    
    const order = await db.orders.create(enhancedOrderData)
    
    // Generate professional invoice
    const invoiceData = {
      orderId: order.id,
      orderDate: order.orderDate || new Date().toISOString(),
      customerName: order.customerName || 'Customer',
      customerEmail: order.customerEmail || '',
      customerPhone: order.customerPhone || '',
      shippingAddress: {
        street: order.shippingAddress.street || '',
        city: order.shippingAddress.city || '',
        state: order.shippingAddress.state || '',
        zipCode: order.shippingAddress.zipCode || '',
        country: order.shippingAddress.country || 'India'
      },
      items: order.items.map((item: any) => ({
        name: item.product?.name || item.name || 'Product',
        quantity: item.quantity || 1,
        price: item.product?.price || item.price || 0,
        total: (item.product?.price || item.price || 0) * (item.quantity || 1)
      })),
      subtotal: order.total * 0.95,
      tax: order.total * 0.05,
      shipping: 0,
      total: order.total,
      deliveryDate,
      trackingNumber,
      paymentMethod: order.paymentMethod || 'Cash on Delivery'
    }
    
    let pdfBuffer: Buffer | null = null
    try {
      const pdfDoc = generateProfessionalInvoice(invoiceData)
      pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'))
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError)
    }
    
    // Send invoice email
    if (order.customerEmail && pdfBuffer) {
      try {
        await sendInvoiceEmail({
          to: order.customerEmail,
          orderId: order.id,
          customerName: order.customerName || 'Customer',
          total: order.total,
          deliveryDate,
          trackingNumber,
          pdfBuffer
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }
    
    return NextResponse.json({
      ...order,
      trackingNumber,
      deliveryDate,
      message: 'Order created successfully. Invoice sent to email.'
    })
  } catch (error) {
    console.error('Order creation error:', error)
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
  
  const orders = await db.orders.getAll()
  return NextResponse.json(orders)
}

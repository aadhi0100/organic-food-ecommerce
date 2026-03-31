import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateProfessionalInvoice } from '@/lib/professionalInvoice'
import { sendInvoiceEmail } from '@/lib/invoiceEmailService'
import { OrderCreateSchema } from '@/lib/validation'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'
import { buildInvoiceData } from '@/lib/invoiceData'

async function getSessionUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1] || '') : ''
  if (!token) return null
  try {
    return await verifySession(token)
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = OrderCreateSchema.safeParse({
      ...body,
      userId: sessionUser.id,
      customerEmail: body.customerEmail || sessionUser.email,
    })
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid order payload' },
        { status: 400 },
      )
    }

    const order = await db.orders.create({
      userId: sessionUser.id,
      cartId: parsed.data.cartId,
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail || sessionUser.email,
      customerPhone: parsed.data.customerPhone,
      shippingAddress: parsed.data.shippingAddress,
      paymentMethod: parsed.data.paymentMethod,
      couponCode: parsed.data.couponCode,
      deliveryType: parsed.data.deliveryType,
      items: parsed.data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      status: 'pending',
      total: 0,
      orderDate: new Date().toISOString(),
    })

    const invoiceData = await buildInvoiceData(order)

    let pdfBuffer: Buffer | null = null
    try {
      const pdfDoc = await generateProfessionalInvoice(invoiceData)
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
          deliveryDate: invoiceData.deliveryDate,
          trackingNumber: invoiceData.trackingNumber,
          pdfBuffer
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }
    
    return NextResponse.json({
      ...order,
      trackingNumber: invoiceData.trackingNumber,
      deliveryDate: invoiceData.deliveryDate,
      message: 'Order created successfully. Invoice sent to email.'
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const sessionUser = await getSessionUser(request)
  if (!sessionUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (sessionUser.role === 'admin') {
    const orders = userId ? await db.orders.findByUserId(userId) : await db.orders.getAll()
    return NextResponse.json(orders)
  }

  // Non-admin users can only see their own orders
  const orders = await db.orders.findByUserId(sessionUser.id)
  return NextResponse.json(orders)
}

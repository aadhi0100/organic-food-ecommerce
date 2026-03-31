import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateProfessionalInvoice } from '@/lib/professionalInvoice'
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
    const pdfDoc = await generateProfessionalInvoice(invoiceData)
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

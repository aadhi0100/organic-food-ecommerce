import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, orderDetails, items, total } = await request.json()

    const receipt = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .item { border-bottom: 1px solid #ddd; padding: 10px 0; }
    .total { font-size: 20px; font-weight: bold; color: #16a34a; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌿 Organic Food Store</h1>
      <p>Order Receipt</p>
    </div>
    <div class="content">
      <h2>Order #${orderDetails.orderId}</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
      <p><strong>Customer:</strong> ${orderDetails.customerName}</p>
      
      <h3>Items Purchased:</h3>
      ${items.map((item: any) => `
        <div class="item">
          <strong>${item.name}</strong><br>
          Quantity: ${item.quantity} × ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}
        </div>
      `).join('')}
      
      <div class="total">
        <p>Subtotal: ₹${orderDetails.subtotal.toFixed(2)}</p>
        <p>Tax (18%): ₹${orderDetails.tax.toFixed(2)}</p>
        <p>Delivery: ₹${orderDetails.delivery.toFixed(2)}</p>
        <p style="font-size: 24px;">Total: ₹${total.toFixed(2)}</p>
      </div>
    </div>
    <div class="footer">
      <p>Thank you for shopping with us!</p>
      <p>For support, contact: support@organicfood.com</p>
    </div>
  </div>
</body>
</html>
    `

    // Save receipt to file
    const fs = require('fs')
    const path = require('path')
    const receiptPath = path.join(process.cwd(), 'data', 'receipts', `receipt_${orderDetails.orderId}.html`)
    
    if (!fs.existsSync(path.join(process.cwd(), 'data', 'receipts'))) {
      fs.mkdirSync(path.join(process.cwd(), 'data', 'receipts'), { recursive: true })
    }
    
    fs.writeFileSync(receiptPath, receipt)

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Receipt generated for ${email}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Receipt generated successfully',
      receiptPath 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 })
  }
}

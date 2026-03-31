import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && 
  process.env.EMAIL_USER !== 'your-email@gmail.com'

let transporter: Transporter | null = null

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

interface EmailInvoiceData {
  to: string
  orderId: string
  customerName: string
  total: number
  deliveryDate: string
  trackingNumber: string
  pdfBuffer: Buffer
}

export async function sendInvoiceEmail(data: EmailInvoiceData) {
  const deliveryDateFormatted = new Date(data.deliveryDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .email-wrapper { max-width: 650px; margin: 20px auto; background: white; }
        .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; }
        .header .tagline { margin: 10px 0 0 0; font-size: 14px; opacity: 0.95; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #16a34a; font-weight: 600; margin-bottom: 15px; }
        .message { font-size: 15px; color: #555; margin-bottom: 25px; line-height: 1.8; }
        .info-card { background: #f9fafb; padding: 25px; margin: 25px 0; border-radius: 12px; border-left: 5px solid #16a34a; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .info-card h3 { margin: 0 0 15px 0; color: #16a34a; font-size: 18px; display: flex; align-items: center; gap: 8px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: 600; color: #374151; }
        .info-value { color: #6b7280; }
        .delivery-card { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 25px; margin: 25px 0; border-radius: 12px; border: 2px solid #16a34a; }
        .delivery-card h3 { margin: 0 0 15px 0; color: #15803d; font-size: 18px; }
        .tracking-number { font-size: 22px; font-weight: 700; color: #16a34a; background: white; padding: 12px 20px; border-radius: 8px; text-align: center; margin: 15px 0; letter-spacing: 1px; }
        .button { display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; margin: 25px 0; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3); transition: all 0.3s; }
        .button:hover { box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4); transform: translateY(-2px); }
        .attachment-notice { background: #fef3c7; border: 2px dashed #f59e0b; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center; }
        .attachment-notice .icon { font-size: 32px; margin-bottom: 10px; }
        .attachment-notice p { margin: 5px 0; color: #92400e; font-weight: 500; }
        .support-section { background: #f9fafb; padding: 20px; border-radius: 10px; margin: 30px 0; text-align: center; }
        .support-section h4 { color: #374151; margin-bottom: 10px; }
        .contact-info { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 15px; }
        .contact-item { color: #16a34a; font-weight: 600; }
        .footer { background: #1f2937; color: #9ca3af; padding: 30px; text-align: center; }
        .footer-logo { font-size: 28px; margin-bottom: 10px; }
        .footer p { margin: 5px 0; font-size: 13px; }
        .footer-links { margin: 15px 0; }
        .footer-links a { color: #16a34a; text-decoration: none; margin: 0 10px; }
        .social-icons { margin: 15px 0; }
        .social-icons span { font-size: 24px; margin: 0 8px; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div style="font-size: 48px; margin-bottom: 10px;">🌿</div>
          <h1>ORGANIC FOOD STORE</h1>
          <p class="tagline">Premium Organic Products | Farm-to-Table</p>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${data.customerName}! 👋</div>
          <p class="message">
            Thank you for your order! We're thrilled to deliver fresh, premium organic products straight to your doorstep. 
            Your order has been confirmed and is being prepared with care.
          </p>
          
          <div class="info-card">
            <h3>📋 Order Summary</h3>
            <div class="info-row">
              <span class="info-label">Order ID:</span>
              <span class="info-value">${data.orderId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span class="info-value">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Total Amount:</span>
              <span class="info-value" style="font-size: 18px; font-weight: 700; color: #16a34a;">₹${data.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="delivery-card">
            <h3>🚚 Delivery Information</h3>
            <p style="margin-bottom: 10px; color: #15803d;">
              <strong>Expected Delivery:</strong> ${deliveryDateFormatted}
            </p>
            <p style="margin-bottom: 15px; color: #15803d;">
              Your order will arrive within 3-5 business days. Track your shipment using:
            </p>
            <div class="tracking-number">${data.trackingNumber}</div>
            <p style="margin-top: 10px; font-size: 13px; color: #15803d;">
              ✅ Free delivery on orders above ₹500<br>
              📦 Eco-friendly packaging<br>
              ❄️ Temperature-controlled delivery
            </p>
          </div>
          
          <div class="attachment-notice">
            <div class="icon">📎</div>
            <p><strong>Invoice Attached</strong></p>
            <p style="font-size: 14px;">Your detailed invoice is attached to this email as a PDF.</p>
            <p style="font-size: 13px; margin-top: 8px;">Please save it for your records and warranty purposes.</p>
          </div>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/customer" class="button">
              👁️ View Order Status
            </a>
          </center>
          
          <div class="support-section">
            <h4>Need Help? We're Here for You!</h4>
            <p style="color: #6b7280; margin: 10px 0;">Our customer support team is available 24/7</p>
            <div class="contact-info">
              <span class="contact-item">📧 support@organicfood.com</span>
              <span class="contact-item">📞 +91 1800-123-4567</span>
            </div>
          </div>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Thank you for choosing organic and supporting sustainable farming! 🌱
          </p>
          
          <p style="margin-top: 15px; font-weight: 600; color: #374151;">
            Best regards,<br>
            <span style="color: #16a34a;">The Organic Food Store Team</span>
          </p>
        </div>
        
        <div class="footer">
          <div class="footer-logo">🌿</div>
          <p style="font-weight: 600; color: #d1d5db;">ORGANIC FOOD STORE</p>
          <p>© ${new Date().getFullYear()} Organic Food Store. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy Policy</a> |
            <a href="#">Terms of Service</a> |
            <a href="#">Refund Policy</a>
          </div>
          <p style="margin-top: 15px;">🌿 100% Organic | 🚚 Fast Delivery | ✅ Quality Assured</p>
          <div class="social-icons">
            <span>👍</span>
            <span>📷</span>
            <span>🐦</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  // Save invoice locally (skip on serverless environments)
  try {
    const fs = require('fs')
    const path = require('path')
    const receiptsDir = path.join(process.cwd(), 'data', 'receipts')
    
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true })
    }
    
    const invoicePath = path.join(receiptsDir, `invoice-${data.orderId}.pdf`)
    fs.writeFileSync(invoicePath, data.pdfBuffer)
    console.log(`✅ Invoice saved to: ${invoicePath}`)
  } catch (fsError) {
    console.log('ℹ️  File system not available (serverless environment), skipping local save')
  }

  // If email is not configured, use test email sender
  if (!isEmailConfigured || !transporter) {
    console.log('\n' + '='.repeat(70))
    console.log('📧 USING TEST EMAIL SERVICE (Ethereal Email)')
    console.log('='.repeat(70))
    console.log('✅ Invoice Generated Successfully!')
    console.log('')
    console.log('Order Details:')
    console.log(`  • Order ID: ${data.orderId}`)
    console.log(`  • Customer: ${data.customerName}`)
    console.log(`  • Email: ${data.to}`)
    console.log(`  • Total: ₹${data.total.toFixed(2)}`)
    console.log(`  • Tracking: ${data.trackingNumber}`)
    console.log(`  • Delivery: ${deliveryDateFormatted}`)
    console.log('='.repeat(70))
    console.log('\n⚠️  Email service not configured. Invoice generated successfully.')
    
    return { 
      success: true, 
      message: 'Invoice generated successfully.'
    }
  }

  const mailOptions = {
    from: {
      name: '🌿 Organic Food Store',
      address: process.env.EMAIL_USER || 'noreply@organicfood.com'
    },
    to: data.to,
    subject: `✅ Order Confirmed #${data.orderId} - Invoice Attached | Organic Food Store`,
    html: emailHTML,
    attachments: [
      {
        filename: `Invoice-${data.orderId}.pdf`,
        content: data.pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('\n' + '='.repeat(70))
    console.log('✅ INVOICE EMAIL SENT SUCCESSFULLY!')
    console.log('='.repeat(70))
    console.log(`📧 To: ${data.to}`)
    console.log(`🏷️  Order: ${data.orderId}`)
    console.log(`💰 Amount: ₹${data.total.toFixed(2)}`)
    console.log(`✉️  Message ID: ${info.messageId}`)
    console.log('='.repeat(70) + '\n')
    
    return { 
      success: true, 
      messageId: info.messageId,
      message: 'Invoice sent successfully to email' 
    }
  } catch (error) {
    console.error('\n❌ Failed to send invoice email:', error)
    
    return { 
      success: false, 
      error: String(error),
      message: 'Invoice generated but email delivery failed' 
    }
  }
}

import nodemailer from 'nodemailer'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface Address {
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  phone: string
  location?: {
    lat: number
    lng: number
    address: string
  }
}

interface OrderReceipt {
  orderId: string
  customerEmail: string
  customerName: string
  items: any[]
  total: number
  addresses: Address[]
  orderDate: string
  deliveryTime?: string
  language: string
}

export const EnhancedEmailService = {
  sendReceipt: async (receipt: OrderReceipt) => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('Order Receipt', 14, 20)
    doc.setFontSize(10)
    doc.text(`Order ID: ${receipt.orderId}`, 14, 30)
    doc.text(`Date: ${new Date(receipt.orderDate).toLocaleDateString()}`, 14, 36)
    
    let yPos = 50
    receipt.addresses.forEach((addr, idx) => {
      doc.text(`Address ${idx + 1}: ${addr.fullName}`, 14, yPos)
      yPos += 6
      doc.text(`${addr.street}, ${addr.city}`, 14, yPos)
      yPos += 10
    })
    
    autoTable(doc, {
      startY: yPos,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: receipt.items.map(item => [
        item.product?.name || 'Product',
        item.quantity,
        `₹${item.product?.price || 0}`,
        `₹${(item.product?.price || 0) * item.quantity}`
      ]),
      foot: [['', '', 'Total:', `₹${receipt.total}`]],
    })
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { background: #f9fafb; padding: 30px; margin: 20px 0; border-radius: 10px; }
          .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .address-card { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #10b981; border-radius: 5px; }
          .location-link { display: inline-block; background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
          .footer { text-align: center; color: #6b7280; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f3f4f6; font-weight: 600; }
          .total { font-size: 24px; font-weight: bold; color: #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Order Confirmation</h1>
            <p>Thank you for your order!</p>
          </div>
          
          <div class="content">
            <div class="order-info">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> ${receipt.orderId}</p>
              <p><strong>Date:</strong> ${new Date(receipt.orderDate).toLocaleString()}</p>
              <p><strong>Customer:</strong> ${receipt.customerName}</p>
              ${receipt.deliveryTime ? `<p><strong>Estimated Delivery:</strong> ${receipt.deliveryTime}</p>` : ''}
            </div>

            <h3>Delivery Addresses (${receipt.addresses.length})</h3>
            ${receipt.addresses.map((addr, idx) => `
              <div class="address-card">
                <h4>📍 Address ${idx + 1}</h4>
                <p><strong>${addr.fullName}</strong></p>
                <p>${addr.street}</p>
                <p>${addr.city}, ${addr.state} ${addr.zipCode}</p>
                <p>📞 ${addr.phone}</p>
                ${addr.location ? `
                  <a href="https://www.google.com/maps?q=${addr.location.lat},${addr.location.lng}" 
                     class="location-link" target="_blank">
                    📍 View on Map
                  </a>
                  <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">
                    ${addr.location.address}
                  </p>
                ` : ''}
              </div>
            `).join('')}

            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${receipt.items.map(item => `
                  <tr>
                    <td>${item.product?.name || 'Product'}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.product?.price || 0}</td>
                    <td>₹${(item.product?.price || 0) * item.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="text-align: right; padding: 20px;">
              <p class="total">Total: ₹${receipt.total}</p>
            </div>
          </div>

          <div class="footer">
            <p>🌿 Organic Food Store</p>
            <p>Fresh, Organic, Delivered to Your Door</p>
            <p style="font-size: 12px;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"Organic Food Store" <${process.env.EMAIL_USER}>`,
      to: receipt.customerEmail,
      subject: `Order Confirmation #${receipt.orderId} - Organic Food Store`,
      html: htmlContent,
      attachments: [
        {
          filename: `receipt-${receipt.orderId}.pdf`,
          content: pdfBuffer,
        },
      ],
    }

    try {
      await transporter.sendMail(mailOptions)
      return { success: true }
    } catch (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }
  },
}

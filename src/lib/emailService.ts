import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const EmailService = {
  sendReceipt: async (to: string, order: any, pdfBlob: Blob) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Order Receipt - ${order.id}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Order ID: <strong>${order.id}</strong></p>
        <p>Total Amount: <strong>₹${order.total}</strong></p>
        <p>Your order has been confirmed and will be delivered soon.</p>
        <br>
        <p>Please find your receipt attached.</p>
        <br>
        <p>Best regards,<br>Organic Food Store</p>
      `,
      attachments: [
        {
          filename: `receipt-${order.id}.pdf`,
          content: Buffer.from(await pdfBlob.arrayBuffer()),
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

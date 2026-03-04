import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

// Test email configuration - uses Ethereal Email (fake SMTP for testing)
let testTransporter: Transporter | null = null

async function createTestTransporter() {
  if (testTransporter) return testTransporter

  try {
    // Create a test account on Ethereal Email
    const testAccount = await nodemailer.createTestAccount()
    
    testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    console.log('\n✅ Test Email Account Created!')
    console.log('📧 Email:', testAccount.user)
    console.log('🔑 Password:', testAccount.pass)
    console.log('🌐 View emails at: https://ethereal.email\n')

    return testTransporter
  } catch (error) {
    console.error('Failed to create test email account:', error)
    return null
  }
}

export async function sendTestEmail(to: string, subject: string, html: string, pdfBuffer: Buffer, orderId: string) {
  const transporter = await createTestTransporter()
  
  if (!transporter) {
    console.log('⚠️  Test email transporter not available')
    return { success: false, error: 'Test transporter not available' }
  }

  const mailOptions = {
    from: '"🌿 Organic Food Store" <noreply@organicfood.com>',
    to,
    subject,
    html,
    attachments: [
      {
        filename: `Invoice-${orderId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    
    console.log('\n' + '='.repeat(70))
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY!')
    console.log('='.repeat(70))
    console.log(`📧 To: ${to}`)
    console.log(`📋 Subject: ${subject}`)
    console.log(`🆔 Message ID: ${info.messageId}`)
    console.log(`🌐 Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    console.log('='.repeat(70))
    console.log('\n💡 TIP: Open the preview URL to see the email!\n')
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    }
  } catch (error) {
    console.error('❌ Failed to send test email:', error)
    return { success: false, error: String(error) }
  }
}

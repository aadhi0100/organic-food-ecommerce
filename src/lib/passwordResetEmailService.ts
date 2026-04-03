import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

const isConfigured =
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) &&
  process.env.EMAIL_USER !== 'your-email@gmail.com'

let transporter: Transporter | null = null

if (isConfigured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export async function sendPasswordResetEmail(data: {
  to: string
  customerName: string
  resetUrl: string
}) {
  const appName = 'Organic'

  if (!transporter) {
    console.log(`[password-reset] reset link for ${data.to}: ${data.resetUrl}`)
    return { sent: false }
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
        <div style="max-width:640px;margin:0 auto;padding:24px;">
          <div style="background:#fff;border-radius:24px;overflow:hidden;border:1px solid #e5e7eb;">
            <div style="background:linear-gradient(135deg,#16a34a,#059669);padding:32px;color:#fff;text-align:center;">
              <h1 style="margin:0;font-size:28px;">Reset your password</h1>
              <p style="margin:12px 0 0;font-size:14px;opacity:.95;">${appName}</p>
            </div>
            <div style="padding:32px;">
              <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
                Hi ${data.customerName},
              </p>
              <p style="font-size:15px;line-height:1.7;margin:0 0 24px;color:#4b5563;">
                We received a request to reset your password. Use the secure link below to choose a new password.
              </p>
              <p style="text-align:center;margin:24px 0;">
                <a href="${data.resetUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:700;">
                  Reset password
                </a>
              </p>
              <p style="font-size:13px;line-height:1.6;color:#6b7280;margin-top:24px;">
                If you did not request this change, you can ignore this email safely.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: {
        name: appName,
        address: process.env.EMAIL_USER || 'noreply@organicfood.com',
      },
      to: data.to,
      subject: `${appName} password reset`,
      html,
      text: `Reset your password: ${data.resetUrl}`,
    })
    console.log(`[password-reset] sent to ${data.to}`)
    return { sent: true }
  } catch (err) {
    console.error('[password-reset] failed:', err)
    return { sent: false }
  }
}

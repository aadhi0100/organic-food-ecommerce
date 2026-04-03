import { NextResponse } from 'next/server'
import { PasswordResetRequestSchema } from '@/lib/validation'
import { UserStore } from '@/lib/userStore'
import { sendPasswordResetEmail } from '@/lib/passwordResetEmailService'

function appBaseUrl(request: Request) {
  const configured = process.env.APP_BASE_URL
  if (configured) {
    const base = configured.replace(/\/+$/, '')
    // Enforce HTTPS in production
    if (process.env.NODE_ENV === 'production') {
      return base.replace(/^http:\/\//i, 'https://')
    }
    return base
  }
  return new URL(request.url).origin
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = PasswordResetRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid reset request' },
        { status: 400 },
      )
    }

    const message = 'If an account exists, a password reset link has been sent.'
    const reset = await UserStore.createPasswordResetToken(parsed.data.identifier)

    if (reset) {
      const resetUrl = `${appBaseUrl(request)}/reset-password/${reset.token}`
      sendPasswordResetEmail({
        to: reset.user.email,
        customerName: reset.user.name || 'there',
        resetUrl,
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, message })
  } catch {
    return NextResponse.json({ error: 'Unable to request password reset' }, { status: 500 })
  }
}

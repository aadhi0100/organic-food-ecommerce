import { NextResponse } from 'next/server'
import { PasswordResetRequestSchema } from '@/lib/validation'
import { UserStore } from '@/lib/userStore'
import { sendPasswordResetEmail } from '@/lib/passwordResetEmailService'

function appBaseUrl(request: Request) {
  return (process.env.APP_BASE_URL || new URL(request.url).origin).replace(/\/+$/g, '')
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

    const reset = await UserStore.createPasswordResetToken(parsed.data.identifier)
    const message = 'If an account exists, a password reset link has been sent.'

    if (!reset) {
      return NextResponse.json({ success: true, message })
    }

    const resetUrl = `${appBaseUrl(request)}/reset-password/${reset.token}`

    // Send password reset email server-side (non-blocking)
    sendPasswordResetEmail({
      to: reset.user.email,
      customerName: reset.user.name || 'there',
      resetUrl,
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      message,
      resetUrl,
      name: reset.user.name || 'there',
      email: reset.user.email,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to request password reset' }, { status: 500 })
  }
}

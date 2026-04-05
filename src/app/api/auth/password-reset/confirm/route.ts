import { NextResponse } from 'next/server'
import { PasswordResetConfirmSchema } from '@/lib/validation'
import { UserStore } from '@/lib/userStore'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = PasswordResetConfirmSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid reset details' },
        { status: 400 },
      )
    }

    const updated = await UserStore.resetPasswordWithToken(parsed.data.token, parsed.data.newPassword)
    if (!updated) {
      return NextResponse.json({ error: 'Reset link is invalid or expired' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: await UserStore.getPublicUser(updated.id) || updated,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to reset password' }, { status: 500 })
  }
}

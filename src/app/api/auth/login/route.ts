import { NextResponse } from 'next/server'
import { applySessionCookie, toSessionUser } from '@/lib/auth/session'
import { PasswordLoginSchema } from '@/lib/validation'
import { UserStore } from '@/lib/userStore'
import { sendWelcomeEmail } from '@/lib/welcomeEmailService'
import { AuthEventStore } from '@/lib/authEventStore'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = PasswordLoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid login details' },
        { status: 400 },
      )
    }

    const user = await UserStore.verifyPassword(parsed.data.identifier, parsed.data.password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const updated = UserStore.updateLastLogin(user.id) || user

    AuthEventStore.record({
      type: 'login',
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      provider: 'password',
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Send welcome back email (non-blocking)
    sendWelcomeEmail({
      to: updated.email,
      name: updated.name,
      isNewUser: false,
    }).catch(() => {})

    const response = NextResponse.json({
      user: UserStore.getPublicUser(updated.id) || updated,
    })
    await applySessionCookie(response, toSessionUser(updated))
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Password login failed' }, { status: 500 })
  }
}

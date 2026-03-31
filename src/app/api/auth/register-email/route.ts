import { NextResponse } from 'next/server'
import { applySessionCookie, toSessionUser } from '@/lib/auth/session'
import { EmailRegisterSchema } from '@/lib/validation'
import { UserStore } from '@/lib/userStore'
import { hashPassword } from '@/lib/auth/password'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = EmailRegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid registration data' },
        { status: 400 },
      )
    }

    const { name, email, phone, password } = parsed.data

    const existing = UserStore.findByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = UserStore.save({
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      authProvider: 'password',
      passwordHash,
      address: '',
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    const response = NextResponse.json({
      success: true,
      user: UserStore.getPublicUser(user.id) || user,
    })
    await applySessionCookie(response, toSessionUser(user))
    return response
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}

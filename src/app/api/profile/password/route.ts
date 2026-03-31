import { NextResponse } from 'next/server'
import { applySessionCookie, SESSION_COOKIE_NAME, toSessionUser, verifySession } from '@/lib/auth/session'
import { PasswordSetupSchema } from '@/lib/validation'
import { UserStore } from '@/lib/userStore'

async function getSessionUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1] || '') : ''
  if (!token) return null
  try {
    return await verifySession(token)
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = PasswordSetupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid password payload' },
        { status: 400 },
      )
    }

    const currentUser = UserStore.findById(sessionUser.id)
    if (!currentUser) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (currentUser.passwordHash) {
      if (!parsed.data.currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
      }
      const verified = await UserStore.verifyPassword(sessionUser.email || currentUser.email, parsed.data.currentPassword)
      if (!verified) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
    }

    const updated = await UserStore.setPassword(currentUser.id, parsed.data.newPassword)
    if (!updated) {
      return NextResponse.json({ error: 'Unable to update password' }, { status: 500 })
    }

    const response = NextResponse.json({
      success: true,
      user: UserStore.getPublicUser(updated.id) || updated,
    })

    await applySessionCookie(response, toSessionUser(updated))
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Password update failed' }, { status: 500 })
  }
}

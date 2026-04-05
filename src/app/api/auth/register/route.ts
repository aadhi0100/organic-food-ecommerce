import { NextResponse } from 'next/server'
import { applySessionCookie, SESSION_COOKIE_NAME, toSessionUser, verifySession } from '@/lib/auth/session'
import { RegisterSchema } from '@/lib/validation'
import { UserStore } from '@/lib/userStore'
import { sendWelcomeEmail } from '@/lib/welcomeEmailService'
import { AuthEventStore } from '@/lib/authEventStore'

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
      return NextResponse.json({ error: 'Please sign in with Google first' }, { status: 401 })
    }

    const contentType = request.headers.get('content-type') || ''
    let name = ''
    let phone = ''
    let address = ''
    let photoUrl: string | undefined

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      name = String(formData.get('name') || '').trim()
      phone = String(formData.get('phone') || '').trim()
      address = String(formData.get('address') || '').trim()
      const photo = formData.get('profilePhoto')
      if (photo instanceof File && photo.size > 0) {
        const buffer = Buffer.from(await photo.arrayBuffer())
        const fileName = `${Date.now()}-${photo.name || 'profile-photo'}`.replace(/\s+/g, '-')
        photoUrl = UserStore.storeProfilePhoto(sessionUser.id, fileName, buffer)
      }
    } else {
      const body = await request.json()
      const parsed = RegisterSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || 'Invalid registration data' },
          { status: 400 },
        )
      }
      name = parsed.data.name
      phone = parsed.data.phone
      address = parsed.data.address
    }

    const parsed = RegisterSchema.safeParse({ name, phone, address })
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid registration data' },
        { status: 400 },
      )
    }

    const updated = await UserStore.completeSignupProfile(sessionUser.id, {
      name,
      phone,
      address,
      ...(photoUrl ? { profilePhoto: photoUrl } : {}),
    })

    if (!updated) {
      return NextResponse.json({ error: 'Unable to save profile' }, { status: 500 })
    }

    const response = NextResponse.json({
      success: true,
      user: await UserStore.getPublicUser(updated.id) || updated,
    })

    AuthEventStore.record({
      type: 'signup',
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      provider: 'google',
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Send welcome email for new signup (non-blocking)
    sendWelcomeEmail({
      to: updated.email,
      name: updated.name,
      isNewUser: true,
    }).catch(() => {})

    await applySessionCookie(response, toSessionUser(updated))
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register profile' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { applySessionCookie, SESSION_COOKIE_NAME, toSessionUser, verifySession } from '@/lib/auth/session'
import { ProfileSchema } from '@/lib/validation'
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

export async function GET(request: Request) {
  const sessionUser = await getSessionUser(request)
  if (!sessionUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const user = UserStore.getPublicUser(sessionUser.id)
  if (!user) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}

export async function PUT(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const contentType = request.headers.get('content-type') || ''
    let name = sessionUser.name
    let phone = sessionUser.phone || ''
    let address = sessionUser.address || ''
    let profilePhoto: string | undefined

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      name = String(formData.get('name') || name).trim()
      phone = String(formData.get('phone') || phone).trim()
      address = String(formData.get('address') || address).trim()
      const photo = formData.get('profilePhoto')
      if (photo instanceof File && photo.size > 0) {
        const buffer = Buffer.from(await photo.arrayBuffer())
        const fileName = `${Date.now()}-${photo.name || 'profile-photo'}`.replace(/\s+/g, '-')
        profilePhoto = UserStore.storeProfilePhoto(sessionUser.id, fileName, buffer)
      }
    } else {
      const body = await request.json()
      const parsed = ProfileSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || 'Invalid profile data' },
          { status: 400 },
        )
      }
      name = parsed.data.name
      phone = parsed.data.phone
      address = parsed.data.address
      profilePhoto = parsed.data.profilePhoto
    }

    const parsed = ProfileSchema.safeParse({ name, phone, address })
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid profile data' },
        { status: 400 },
      )
    }

    const updated = await UserStore.updateProfile(sessionUser.id, {
      name,
      phone,
      address,
      ...(profilePhoto ? { profilePhoto, picture: profilePhoto } : {}),
    })

    if (!updated) {
      return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
    }

    const response = NextResponse.json({ user: UserStore.getPublicUser(updated.id) || updated })
    await applySessionCookie(response, toSessionUser(updated))
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
  }
}

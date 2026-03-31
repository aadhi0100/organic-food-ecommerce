import { NextResponse } from 'next/server'
import { applySessionCookie, SESSION_COOKIE_NAME, toSessionUser, verifySession } from '@/lib/auth/session'
import { AddressSchema } from '@/lib/validation'
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

  const user = UserStore.findById(sessionUser.id)
  return NextResponse.json({ addresses: user?.addresses || [] })
}

export async function POST(request: Request) {
  const sessionUser = await getSessionUser(request)
  if (!sessionUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = AddressSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid address data' },
      { status: 400 },
    )
  }

  const updated = UserStore.addAddress(sessionUser.id, parsed.data)
  if (!updated) {
    return NextResponse.json({ error: 'Unable to add address' }, { status: 500 })
  }

  const response = NextResponse.json({ user: UserStore.getPublicUser(sessionUser.id) || updated })
  await applySessionCookie(response, toSessionUser(updated))
  return response
}

export async function PUT(request: Request) {
  const sessionUser = await getSessionUser(request)
  if (!sessionUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json()
  const addressId = String(body.addressId || '').trim()
  if (!addressId) {
    return NextResponse.json({ error: 'addressId is required' }, { status: 400 })
  }

  if (body.setDefault) {
    const updated = UserStore.setDefaultAddress(sessionUser.id, addressId)
    if (!updated) {
      return NextResponse.json({ error: 'Unable to update default address' }, { status: 500 })
    }
    const response = NextResponse.json({ user: UserStore.getPublicUser(sessionUser.id) || updated })
    await applySessionCookie(response, toSessionUser(updated))
    return response
  }

  const parsed = AddressSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid address data' },
      { status: 400 },
    )
  }

  const updated = UserStore.updateAddress(sessionUser.id, addressId, parsed.data)
  if (!updated) {
    return NextResponse.json({ error: 'Unable to update address' }, { status: 500 })
  }

  const response = NextResponse.json({ user: UserStore.getPublicUser(sessionUser.id) || updated })
  await applySessionCookie(response, toSessionUser(updated))
  return response
}

export async function DELETE(request: Request) {
  const sessionUser = await getSessionUser(request)
  if (!sessionUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const url = new URL(request.url)
  const addressId = url.searchParams.get('addressId') || ''
  if (!addressId) {
    return NextResponse.json({ error: 'addressId is required' }, { status: 400 })
  }

  const updated = UserStore.removeAddress(sessionUser.id, addressId)
  if (!updated) {
    return NextResponse.json({ error: 'Unable to remove address' }, { status: 500 })
  }

  const response = NextResponse.json({ user: UserStore.getPublicUser(sessionUser.id) || updated })
  await applySessionCookie(response, toSessionUser(updated))
  return response
}

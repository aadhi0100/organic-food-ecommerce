import { NextResponse } from 'next/server'
import { CartStore } from '@/lib/cartStore'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'

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
  const url = new URL(request.url)
  const cartId = url.searchParams.get('cartId')
  if (!cartId) {
    return NextResponse.json({ error: 'cartId is required' }, { status: 400 })
  }

  const sessionUser = await getSessionUser(request)
  const cart = await CartStore.getCart(cartId, sessionUser?.id)
  return NextResponse.json(cart)
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    const body = await request.json()
    const cartId = String(body.cartId || '').trim()
    const action = String(body.action || '').trim()

    if (!cartId) {
      return NextResponse.json({ error: 'cartId is required' }, { status: 400 })
    }

    switch (action) {
      case 'reserve': {
        const productId = String(body.productId || '').trim()
        const quantity = Number(body.quantity || 0)
        const result = await CartStore.reserveItem(cartId, sessionUser?.id, productId, quantity)
        if ('error' in result) {
          return NextResponse.json({ error: result.error, available: result.available || 0 }, { status: 400 })
        }
        return NextResponse.json(result.cart)
      }
      case 'set-quantity': {
        const productId = String(body.productId || '').trim()
        const quantity = Number(body.quantity || 0)
        const result = await CartStore.setItemQuantity(cartId, sessionUser?.id, productId, quantity)
        if ('error' in result) {
          return NextResponse.json({ error: result.error, available: result.available || 0 }, { status: 400 })
        }
        return NextResponse.json(result.cart)
      }
      case 'remove': {
        const productId = String(body.productId || '').trim()
        const result = await CartStore.removeItem(cartId, sessionUser?.id, productId)
        return NextResponse.json(result.cart)
      }
      case 'sync': {
        const items = Array.isArray(body.items) ? (body.items as unknown[]) : []
        const result = await CartStore.syncCart(
          cartId,
          sessionUser?.id,
          items.map((item: unknown) => {
            const i = item as { productId?: unknown; quantity?: unknown }
            return {
              productId: String(i?.productId || ''),
              quantity: Number(i?.quantity || 0),
            }
          }).filter((item) => item.productId && item.quantity > 0),
        )
        if ('error' in result) {
          return NextResponse.json({ error: result.error, available: result.available || 0 }, { status: 400 })
        }
        return NextResponse.json(result.cart)
      }
      default:
        return NextResponse.json({ error: 'Unsupported cart action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Cart update failed' }, { status: 500 })
  }
}

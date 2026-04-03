import { NextResponse } from 'next/server'
import { PriceManager } from '@/lib/priceManager'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'

async function getSessionUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1] || '') : ''
  if (!token) return null
  try { return await verifySession(token) } catch { return null }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || (sessionUser.role !== 'vendor' && sessionUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { productId, vendorId, basePrice, dailyPrice, discount, reason } = await request.json()

    PriceManager.updateDailyPrice({
      productId,
      vendorId,
      basePrice,
      dailyPrice,
      date: new Date().toISOString().split('T')[0] || '',
      discount,
      reason,
    })

    return NextResponse.json({ success: true, message: 'Price updated successfully' })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update price' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || (sessionUser.role !== 'vendor' && sessionUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const vendorId = searchParams.get('vendorId')
    const basePrice = parseFloat(searchParams.get('basePrice') || '0')

    if (!productId || !vendorId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const priceInfo = PriceManager.getFinalPrice(productId, vendorId, basePrice)
    return NextResponse.json(priceInfo)
  } catch {
    return NextResponse.json({ error: 'Failed to get price' }, { status: 500 })
  }
}

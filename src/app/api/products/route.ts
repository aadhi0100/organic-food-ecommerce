import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProductStore } from '@/lib/productStore'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'

async function getSessionUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1] || '') : ''
  if (!token) return null
  try { return await verifySession(token) } catch { return null }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const featured = searchParams.get('featured')
  
  const filter: { category?: string; search?: string } = {}
  if (category) filter.category = category
  if (search) filter.search = search
  
  let products = await db.products.findMany(filter)
  
  if (featured === 'true') {
    products = await db.products.findFeatured()
  }
  
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || (sessionUser.role !== 'admin' && sessionUser.role !== 'vendor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const body = await request.json()
    const saved = await ProductStore.upsert(body)
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 })
  }
}

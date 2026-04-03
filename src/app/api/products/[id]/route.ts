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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.products.findById(id)
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  
  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser || (sessionUser.role !== 'admin' && sessionUser.role !== 'vendor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const { id } = await params
    const body = await request.json()
    const saved = await ProductStore.upsert({ ...body, id })
    return NextResponse.json(saved)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

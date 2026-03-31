import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProductStore } from '@/lib/productStore'

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
    const { id } = await params
    const body = await request.json()
    const saved = await ProductStore.upsert({ ...body, id })
    return NextResponse.json(saved)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
  const body = await request.json()
  return NextResponse.json(body, { status: 201 })
}

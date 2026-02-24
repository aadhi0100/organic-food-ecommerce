import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const shops = await db.shops.findMany()
    return NextResponse.json(shops)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 })
  }
}

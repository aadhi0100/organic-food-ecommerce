import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    
    const existing = await db.users.findByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    
    const user = await db.users.create({ email, password, name, role: 'customer' })
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}

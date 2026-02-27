import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const user = await db.users.findByEmail(email)
    
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const { password: _, ...userWithoutPassword } = user
    
    // Create JWT token
    const token = sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' })
    
    const response = NextResponse.json(userWithoutPassword)
    
    // Set cookies with proper settings for Vercel
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    })
    
    response.cookies.set('userRole', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

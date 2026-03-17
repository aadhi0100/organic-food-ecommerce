import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { SESSION_COOKIE_NAME } from '@/lib/auth/session'

function getSessionSecret() {
  const raw = process.env.APP_SESSION_SECRET || process.env.JWT_SECRET
  if (!raw) return null
  return new TextEncoder().encode(raw)
}

async function getRoleFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const secret = getSessionSecret()
  if (!secret) return null

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
    const role = payload.role
    return role === 'admin' || role === 'vendor' || role === 'customer' ? role : null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const redirectToLogin = () => {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', path)
    return NextResponse.redirect(loginUrl)
  }

  const role = await getRoleFromRequest(request)

  // Admin routes
  if (path.startsWith('/dashboard/admin')) {
    if (role !== 'admin') return redirectToLogin()
    return NextResponse.next()
  }

  // Vendor routes
  if (path.startsWith('/dashboard/vendor')) {
    if (role !== 'vendor') return redirectToLogin()
    return NextResponse.next()
  }

  // Customer routes
  if (path.startsWith('/dashboard/customer')) {
    if (role !== 'customer') return redirectToLogin()
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}

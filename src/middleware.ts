import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const userRole = request.cookies.get('userRole')?.value

  // Admin routes
  if (path.startsWith('/dashboard/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Vendor routes
  if (path.startsWith('/dashboard/vendor')) {
    if (userRole !== 'vendor') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Customer routes
  if (path.startsWith('/dashboard/customer')) {
    if (userRole !== 'customer') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Checkout - require login
  if (path.startsWith('/checkout') || path.startsWith('/order-success')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login?redirect=' + path, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout', '/order-success']
}

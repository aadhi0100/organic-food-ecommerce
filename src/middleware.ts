import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'
import { getDashboardPath, hasCompletedOnboarding } from '@/lib/auth/routing'

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  try {
    return await verifySession(token)
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const pathWithQuery = `${path}${request.nextUrl.search}`
  const redirectToLogin = () => {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathWithQuery)
    return NextResponse.redirect(loginUrl)
  }

  const session = await getSessionFromRequest(request)
  const role = session?.role || null

  if (path === '/login') {
    if (role) {
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url))
    }
    return NextResponse.next()
  }

  if (path === '/register') {
    if (role && hasCompletedOnboarding(session)) {
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url))
    }
    return NextResponse.next()
  }

  if (path === '/dashboard') {
    if (!role) return redirectToLogin()
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url))
  }

  if (path.startsWith('/dashboard/admin')) {
    if (role !== 'admin') return redirectToLogin()
    return NextResponse.next()
  }

  if (path.startsWith('/dashboard/vendor')) {
    if (role !== 'vendor') return redirectToLogin()
    return NextResponse.next()
  }

  if (path.startsWith('/dashboard/customer')) {
    if (role !== 'customer') return redirectToLogin()
    return NextResponse.next()
  }

  if (path.startsWith('/profile')) {
    if (!role) return redirectToLogin()
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/profile/:path*', '/login', '/register']
}

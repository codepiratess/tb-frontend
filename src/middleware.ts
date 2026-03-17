import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
  '/cart',
  '/checkout', 
  '/orders',
  '/wishlist',
  '/profile',
]
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const token = request.cookies.get('townbolt_token')?.value
  const role = request.cookies.get('townbolt_role')?.value

  const isAdminRoute = pathname.startsWith('/admin')
  const isProtectedRoute = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r))

  // Admin route: no token → login
  if (isAdminRoute && !token) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Admin route: logged in but not admin
  if (isAdminRoute && token && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Protected route: no token → login
  if (isProtectedRoute && !token) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Auth route: already logged in → home
  if (isAuthRoute && token) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/cart',
    '/checkout/:path*',
    '/orders/:path*',
    '/wishlist',
    '/profile/:path*',
    '/auth/:path*',
  ],
}

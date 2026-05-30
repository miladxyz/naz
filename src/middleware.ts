import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('payload-token')?.value

  // Protect /dashboard — redirect to /auth if not logged in
  if (pathname.startsWith('/dashboard') && !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Already logged in — skip /auth page
  if (pathname === '/auth' && token) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
}

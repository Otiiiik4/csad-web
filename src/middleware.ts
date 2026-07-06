import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * MAINTENANCE MODE MIDDLEWARE
 * ===========================
 * Redirects ALL visitors to the /udrzba page.
 * 
 * To DISABLE maintenance mode and restore the site:
 *   1. Delete this file (src/middleware.ts)
 *   2. Push to GitHub
 *   3. Vercel will automatically redeploy without the redirect
 */

const MAINTENANCE_PATH = '/udrzba'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Don't redirect if already on the maintenance page
  if (pathname.startsWith(MAINTENANCE_PATH)) {
    return NextResponse.next()
  }

  // Allow Next.js internals, static files, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/sw.js') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Redirect everything else to maintenance page
  const url = request.nextUrl.clone()
  url.pathname = MAINTENANCE_PATH
  return NextResponse.redirect(url)
}

export const config = {
  // Run on all routes
  matcher: ['/((?!_next/static|_next/image).*)'],
}

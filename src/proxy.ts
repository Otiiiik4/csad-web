import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * REŽIM ÚDRŽBY
 * ============
 * Přesměrovává běžné návštěvníky na /udrzba.
 *
 * Zapnutí/vypnutí bez zásahu do kódu:
 *   Vercel → Settings → Environment Variables → MAINTENANCE_MODE
 *     "on"  (nebo nenastaveno) = údržba běží
 *     "off"                    = web je veřejně přístupný
 *   Po změně stačí Redeploy, není potřeba nic commitovat.
 *
 * Sekce /admin, /profil a /registrace zůstávají dostupné i během údržby,
 * aby šlo areál spravovat.
 *
 * Pozn.: v Next.js 16 se soubor `middleware.ts` přejmenoval na `proxy.ts`
 * a exportovaná funkce z `middleware` na `proxy`. Chování je stejné.
 */

const MAINTENANCE_PATH = '/udrzba'

/** Cesty, které zůstávají dostupné i během údržby (správa areálu). */
const ALWAYS_ALLOWED = ['/udrzba', '/admin', '/profil', '/registrace']

export function proxy(request: NextRequest) {
  // Vypnuto přes env → web běží normálně
  if (process.env.MAINTENANCE_MODE === 'off') {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Údržbová stránka a správa areálu jsou dostupné vždy
  if (ALWAYS_ALLOWED.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next()
  }

  // Interní cesty Next.js, statické soubory a API necháváme projít
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

  // Všechno ostatní na údržbovou stránku
  const url = request.nextUrl.clone()
  url.pathname = MAINTENANCE_PATH
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}

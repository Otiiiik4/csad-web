import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * REŽIM ÚDRŽBY
 * ============
 * Přesměrovává běžné návštěvníky na /udrzba.
 *
 * Přepíná se tlačítkem v /admin/dashboard (uloží se do tabulky `nastaveni`,
 * sloupec `udrzba_aktivni`). Projeví se do ~15 vteřin, viz CACHE_MS níže.
 *
 * Nouzová brzda přes proměnnou prostředí MAINTENANCE_MODE (Vercel → Settings →
 * Environment Variables). Ta má přednost před databází — hodí se, když je
 * Supabase nedostupný nebo se do dashboardu z nějakého důvodu nedostaneš:
 *   "on"  = údržba běží vždy
 *   "off" = web je vždy přístupný  (tohle je i v .env.local pro lokální vývoj)
 *   nenastaveno = rozhoduje databáze
 *
 * Sekce /admin, /profil a /registrace zůstávají dostupné i během údržby,
 * aby šlo areál spravovat. Patří sem i /admin/nove-heslo, jinak by obnovovací
 * odkaz z e-mailu skončil na údržbové stránce.
 *
 * Pozn.: v Next.js 16 se soubor `middleware.ts` přejmenoval na `proxy.ts`
 * a exportovaná funkce z `middleware` na `proxy`. Chování je stejné.
 */

const MAINTENANCE_PATH = '/udrzba'

/** Cesty, které zůstávají dostupné i během údržby (správa areálu). */
const ALWAYS_ALLOWED = ['/udrzba', '/admin', '/profil', '/registrace']

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** Jak dlouho věříme jednou načtené hodnotě, než se zeptáme znovu. */
const CACHE_MS = 15_000

// Proxy běží na edge a dokumentace varuje, že se na sdílený stav nedá
// spoléhat — každá instance má vlastní. Bereme to jako bonus: když se cache
// netrefí, prostě se zeptáme databáze znovu.
let posledniZnama: boolean | null = null
let platiDo = 0

async function jeUdrzbaZapnuta(): Promise<boolean> {
  const prepinac = process.env.MAINTENANCE_MODE
  if (prepinac === 'off') return false
  if (prepinac === 'on') return true

  if (posledniZnama !== null && Date.now() < platiDo) return posledniZnama
  if (!SUPABASE_URL || !SUPABASE_KEY) return posledniZnama ?? false

  try {
    const odpoved = await fetch(
      `${SUPABASE_URL}/rest/v1/nastaveni?select=udrzba_aktivni&limit=1`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        cache: 'no-store',
      }
    )
    if (!odpoved.ok) return posledniZnama ?? false

    const radky: Array<{ udrzba_aktivni: boolean | null }> = await odpoved.json()
    posledniZnama = radky[0]?.udrzba_aktivni === true
    platiDo = Date.now() + CACHE_MS
    return posledniZnama
  } catch {
    // Supabase nedostupný → držíme se poslední známé hodnoty. Když žádnou
    // nemáme, web raději ukážeme, než abychom ho kvůli výpadku databáze
    // schovali. Na jisté zhasnutí je MAINTENANCE_MODE=on.
    return posledniZnama ?? false
  }
}

export async function proxy(request: NextRequest) {
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

  // Na databázi se ptáme až tady, ať se kvůli tomu nezdržují statické soubory
  // ani přihlašování do správy.
  if (!(await jeUdrzbaZapnuta())) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = MAINTENANCE_PATH
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}

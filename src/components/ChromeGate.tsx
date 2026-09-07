'use client'

import { usePathname } from 'next/navigation'

/**
 * Skryje "obal" webu (navigace, patička, plovoucí prvky) na stránkách, které
 * mají být samostatné — dnes jen údržbová stránka.
 *
 * Proč to není přes vlastní layout: /udrzba dřív mělo vlastní layout.tsx
 * s <html> a <body>, jenže ten je vnořený v root layoutu, takže se do stránky
 * dostaly dva <html> a dva <body> a s nimi i celý Navbar. Návštěvník pak na
 * údržbové stránce viděl navigaci s odkazy, které ho vracely zpátky na údržbu.
 *
 * Čistší varianta jsou route groups s více root layouty, ta by ale znamenala
 * přesunout všechny stránky do (web)/. Až se web rozroste, stojí za zvážení.
 */
const STANDALONE_PATHS = ['/udrzba']

export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isStandalone = STANDALONE_PATHS.some(
    p => pathname === p || pathname.startsWith(`${p}/`)
  )

  if (isStandalone) return null
  return <>{children}</>
}

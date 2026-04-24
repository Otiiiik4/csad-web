import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import type { WebStatus, Cena } from '@/lib/types'
import HeroSection from './HeroSection'
import StickyScrollSection from '@/components/StickyScrollSection'
import ServicesGrid from './ServicesGrid'
import MottoSection from './MottoSection'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Logistický areál CSAD Rýmařov — Centrum služeb a podnikání',
  description:
    'Kompletní zázemí pro podnikání, dopravu a volný čas v Rýmařově. Digitální tisk, čerpací stanice NONSTOP, parkování TIR, hudební klub Proxy a mnoho dalšího.',
}

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const sb = createServerClient()

  const [{ data: statusy }, { data: ceny }] = await Promise.all([
    sb.from('web_status').select('*'),
    sb.from('ceny').select('*'),
  ])

  const statuses: WebStatus[] = statusy ?? []
  const prices: Cena[] = ceny ?? []

  const isActive = (kod: string) =>
    statuses.find(s => s.kod === kod)?.aktivni ?? false

  const dieselPrice = prices.find(c => c.typ === 'diesel')?.hodnota

  return (
    <div className={styles.page}>
      <HeroSection />
      <StickyScrollSection />
      <MottoSection />
      <section className={styles.servicesSection}>
        <div className="container">
          <ServicesGrid isActive={isActive} dieselPrice={dieselPrice} />
        </div>
      </section>
    </div>
  )
}

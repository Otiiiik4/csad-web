import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import SubpageHero from '@/components/SubpageHero'
import LockedService from '@/components/LockedService'
import type { Akce } from '@/lib/types'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Hudební klub Proxy',
  description: 'Nejlepší zvuk, živé koncerty a párty v industriálním srdci Rýmařova. Klub Proxy v areálu CSAD Rýmařov.',
}

export const revalidate = 120

export default async function KlubPage() {
  const sb = createServerClient()

  const { data: status } = await sb.from('web_status').select('aktivni').eq('kod', 'klub').single()
  if (status && status.aktivni === false) return <LockedService title="Hudební klub Proxy" />

  const { data: akce } = await sb.from('akce').select('*').order('id', { ascending: true })
  const events: Akce[] = akce ?? []

  return (
    <>
      <SubpageHero
        title={<>KLUB <span className={styles.flickerPink}>PROXY</span></>}
        subtitle="Nejlepší zvuk, živé koncerty a párty v industriálním srdci Rýmařova."
        bgImage="https://images.unsplash.com/photo-1574155376612-bfaeb5853047?q=80&w=2070&auto=format&fit=crop"
        accentColor="var(--color-pink)"
      />

      <div className="container-md">
        <div className={styles.wrapper}>

          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.sectionTitle}>📅 Nadcházející <span className="text-pink">události</span></h2>
              <p className={styles.sectionSub}>
                Pro nákup vstupenek a nejnovější info navštivte{' '}
                <a href="https://www.proxyrymarov.cz/" target="_blank" rel="noopener noreferrer" className={styles.pinkLink}>
                  proxyrymarov.cz
                </a>
              </p>
            </div>
            <a href="https://www.proxyrymarov.cz/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ borderColor: 'var(--color-pink)', color: 'var(--color-pink)' }}>
              Oficiální web ↗
            </a>
          </div>

          {/* Events */}
          <div className={styles.eventsList}>
            {events.length > 0 ? events.map((a, i) => (
              <div key={a.id} className={`${styles.eventCard} card spotlight`} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className={styles.dateBox}>
                  <span className={styles.dateText}>{a.datum}</span>
                  <span className={styles.timeText}>Od {a.cas}</span>
                </div>
                <div className={styles.eventInfo}>
                  <h3 className={styles.eventTitle}>{a.nazev}</h3>
                  <p className={styles.eventStatus}>{a.stav}</p>
                </div>
                <div className={styles.priceBox}>
                  <span className={styles.eventPrice}>{a.cena === 0 ? 'ZDARMA' : `${a.cena.toLocaleString('cs-CZ')} Kč`}</span>
                  <a href="https://www.proxyrymarov.cz/" target="_blank" rel="noopener noreferrer" className={styles.ticketBtn}>
                    Vstupenky ↗
                  </a>
                </div>
              </div>
            )) : (
              <div className={`${styles.emptyState} card`}>
                <span>🎸</span>
                <p>Momentálně nejsou vypsány žádné nové akce.</p>
                <p>Sledujte <a href="https://www.proxyrymarov.cz/" target="_blank" rel="noopener noreferrer" className={styles.pinkLink}>proxyrymarov.cz</a> pro nejčerstvější program.</p>
              </div>
            )}
          </div>

          {/* Info cards */}
          <div className={styles.infoGrid}>
            {[
              { icon: '🍻', title: 'Bar & Občerstvení', desc: 'Plně zásobený bar, točené pivo, prémiové drinky a drobné občerstvení po celou noc.' },
              { icon: '🔊', title: 'Zvuk & Světla', desc: 'Profesionální ozvučení a světelná show, která vás vtáhne do děje.' },
              { icon: '📍', title: 'Kde jsme?', desc: 'Uvnitř areálu CSAD. Vstup z boční ulice. Parkování před klubem zdarma.' },
            ].map(c => (
              <div key={c.title} className={`${styles.infoCard} card spotlight`}>
                <span className={styles.infoIcon}>{c.icon}</span>
                <h3 className={styles.infoTitle}>{c.title}</h3>
                <p className={styles.infoDesc}>{c.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

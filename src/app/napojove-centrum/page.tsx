import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import SubpageHero from '@/components/SubpageHero'
import LockedService from '@/components/LockedService'
import type { Napoj } from '@/lib/types'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Nápojové centrum',
  description: 'Velkoobchodní a maloobchodní prodej nápojů, alkoholu, tabáku a pochutin v areálu CSAD Rýmařov.',
}

export const revalidate = 120

const CATEGORY_LABELS: Record<string, string> = {
  alko: '🍺 Alkohol',
  nealko: '🥤 Nealkoholické',
  tabak: '🚬 Tabák',
  pochutiny: '🍿 Pochutiny',
}

export default async function NapojoveCentrumPage() {
  const sb = createServerClient()

  const { data: status } = await sb.from('web_status').select('aktivni').eq('kod', 'napoje').single()
  if (status && status.aktivni === false) return <LockedService title="Nápojové centrum" />

  const { data: napoje } = await sb.from('napoje').select('*').order('kategorie').order('nazev')
  const items: Napoj[] = napoje ?? []

  const byCategory = items.reduce<Record<string, Napoj[]>>((acc, n) => {
    if (!acc[n.kategorie]) acc[n.kategorie] = []
    acc[n.kategorie].push(n)
    return acc
  }, {})

  const categoryOrder = ['alko', 'nealko', 'tabak', 'pochutiny']

  return (
    <>
      <SubpageHero
        title={<>NÁPOJOVÉ <span style={{ color: 'var(--color-red)' }}>CENTRUM</span></>}
        subtitle="Velkoobchod i maloobchod. Nápoje, alkohol, tabák a pochutiny za výhodné ceny."
        bgImage="https://images.unsplash.com/photo-1586901533048-0e856dff2c0d?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="container-md">
        <div className={styles.wrapper}>
          <p className={styles.intro}>
            Nabízíme široký výběr nápojů pro velkoobchodní i maloobchodní nákup. Otevřeno pro veřejnost i firmy.
          </p>

          {items.length === 0 ? (
            <div className={`${styles.emptyState} card`}>
              <span>🥤</span>
              <p>Sortiment se průběžně doplňuje. Navštivte nás osobně nebo volejte pro aktuální nabídku.</p>
              <a href="tel:+420601223344" className={styles.telLink}>📞 +420 601 223 344</a>
            </div>
          ) : (
            categoryOrder.filter(cat => byCategory[cat]?.length).map(cat => (
              <div key={cat} className={styles.categorySection}>
                <div className="cat-title">{CATEGORY_LABELS[cat]}</div>
                <div className={styles.napojGrid}>
                  {byCategory[cat].map(n => (
                    <div key={n.id} className={`${styles.napojCard} card ${n.stav === 'Vyprodáno' ? 'passive' : ''}`}>
                      {n.stav === 'Vyprodáno' && <span className="badge badge-dim" style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>Vyprodáno</span>}
                      {n.akcni_cena && <span className="badge badge-yellow" style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>AKCE</span>}
                      
                      {n.obrazek_url ? (
                        <div className={styles.napojImageWrapper}>
                          <img src={n.obrazek_url} alt={n.nazev} className={styles.napojImage} loading="lazy" />
                        </div>
                      ) : (
                        <div className={styles.napojImageWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '3rem', opacity: 0.2 }}>🥤</span>
                        </div>
                      )}

                      <div className={styles.napojName}>{n.nazev}</div>
                      <div className={styles.napojPrice}>
                        {n.akcni_cena ? (
                          <>
                            <span className={styles.oldPrice}>{n.cena.toLocaleString('cs-CZ')} Kč</span>
                            <span className={styles.newPrice} style={{ color: 'var(--color-yellow)' }}>{n.akcni_cena.toLocaleString('cs-CZ')} Kč</span>
                          </>
                        ) : (
                          <span className={styles.newPrice}>{n.cena.toLocaleString('cs-CZ')} Kč</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className={`${styles.infoBar} card`}>
            <div>
              <strong>📍 Otevírací doba:</strong> Po–Pá 7:00–17:00, So 8:00–12:00
            </div>
            <a href="tel:+420601223344" className={styles.telLink}>📞 +420 601 223 344</a>
          </div>
        </div>
      </div>
    </>
  )
}

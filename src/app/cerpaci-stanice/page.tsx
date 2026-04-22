import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import SubpageHero from '@/components/SubpageHero'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Čerpací stanice NONSTOP',
  description: 'Čerpací stanice NONSTOP v areálu CSAD Rýmařov. Nafta, benzín Natural 95 a AdBlue za aktuální ceny.',
}

export const revalidate = 60

export default async function CerpaciPage() {
  const sb = createServerClient()
  const { data: ceny } = await sb.from('ceny').select('*')

  const getPrice = (typ: string) =>
    ceny?.find(c => c.typ === typ)?.hodnota?.toLocaleString('cs-CZ', { minimumFractionDigits: 2 }) ?? '—'

  return (
    <>
      <SubpageHero
        title={<>ČERPACÍ <span style={{ color: 'var(--color-yellow)' }}>STANICE</span></>}
        subtitle="Kvalitní pohonné hmoty 24 hodin denně, 7 dní v týdnu."
        bgImage="https://images.unsplash.com/photo-1545236773-46a2ba8e0f03?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container-md">
        <div className={styles.wrapper}>
          <p className={styles.intro}>
            Naše čerpací stanice funguje v nepřetržitém provozu. Přijímáme platby kartou i hotovostí. Vhodné pro osobní automobily i nákladní vozy.
          </p>

          {/* Ceny paliv */}
          <div className="cat-title">⛽ Aktuální ceny paliv</div>
          <div className={styles.priceGrid}>
            {[
              { typ: 'diesel', label: 'Nafta', icon: '🚛', color: 'var(--color-yellow)', desc: 'Motorová nafta EN 590' },
              { typ: 'natural', label: 'Natural 95', icon: '⛽', color: 'var(--color-green)', desc: 'Bezolovnatý benzín' },
              { typ: 'adblue', label: 'AdBlue', icon: '💧', color: 'var(--color-blue)', desc: 'Redukovací činidlo pro Euro 6' },
            ].map(f => (
              <div key={f.typ} className={`${styles.priceCard} card spotlight`}>
                <div className={styles.fuelIcon}>{f.icon}</div>
                <div className={styles.fuelLabel}>{f.label}</div>
                <div className={styles.fuelDesc}>{f.desc}</div>
                <div className={styles.fuelPrice} style={{ color: f.color }}>
                  {getPrice(f.typ)}
                  <span className={styles.fuelUnit}> Kč/l</span>
                </div>
              </div>
            ))}
          </div>

          {/* Info sekce */}
          <div className={styles.infoGrid}>
            <div className={`${styles.infoCard} card`}>
              <h3>🕐 PROVOZNÍ DOBA</h3>
              <div className={styles.nonstop}>NONSTOP</div>
              <p>24 hodin denně, 7 dní v týdnu, 365 dní v roce</p>
            </div>
            <div className={`${styles.infoCard} card`}>
              <h3>💳 PLATBA</h3>
              <ul className={styles.list}>
                <li>✓ Platební karty</li>
                <li>✓ Hotovost</li>
                <li>✓ Fleetové karty</li>
              </ul>
            </div>
            <div className={`${styles.infoCard} card`}>
              <h3>🚛 VÝJEZD</h3>
              <ul className={styles.list}>
                <li>✓ Osobní automobily</li>
                <li>✓ Nákladní vozy (TIR)</li>
                <li>✓ Autobusy</li>
                <li>✓ Zemědělská technika</li>
              </ul>
            </div>
            <div className={`${styles.infoCard} card`}>
              <h3>📍 LOKALITA</h3>
              <p>Žižkova 260/21, Rýmařov</p>
              <p style={{ marginTop: 10, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Snadný vjezd přímo z hlavní třídy. Prostorné stání pro kamiony.</p>
              <a href="tel:+420601223344" className={styles.telLink}>📞 +420 601 223 344</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

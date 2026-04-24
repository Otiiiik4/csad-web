import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import SubpageHero from '@/components/SubpageHero'
import LockedService from '@/components/LockedService'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Parkování TIR a Garáže',
  description: 'Hlídané parkoviště pro nákladní vozy TIR, autobusy i osobní auta. Pronájem XXL garáží s montážní jámou v areálu CSAD Rýmařov.',
}

export const revalidate = 60

export default async function ParkovaniPage() {
  const sb = createServerClient()
  
  const { data: status } = await sb.from('web_status').select('aktivni').eq('kod', 'parkovani').single()
  if (status && status.aktivni === false) return <LockedService title="Parkování a Garáže" />

  const { data: garaze } = await sb.from('garaze').select('*')

  const getCena = (typ: string) =>
    garaze?.find(g => g.typ === typ)?.cena?.toLocaleString('cs-CZ') ?? '—'

  return (
    <>
      <SubpageHero
        title={<>PARKOVÁNÍ <span style={{ color: 'var(--color-yellow)' }}>TIR</span></>}
        subtitle="Bezpečné a prostorné zázemí pro váš vozový park i soukromé vozidlo."
        bgImage="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container-md">
        <div className={styles.wrapper}>
          <p className={styles.intro}>
            Rozlehlé zpevněné plochy pod dohledem kamerového systému a noční ostrahy. K dispozici sociální zázemí a sprchy pro řidiče.
          </p>

          <div className="cat-title">🚛 Ceník parkování</div>
          <div className={styles.priceGrid}>
            {[
              { typ: 'kamion_noc', icon: '🌙', title: 'TIR', sub: '1 noc', desc: 'Přes noc (12h). V ceně WC a sprcha.', unit: '/ noc' },
              { typ: 'kamion_vikend', icon: '⏸️', title: 'TIR', sub: 'Víkend', desc: 'Celovíkendové stání (Pá–Ne). Bezpečný uzavřený areál.', unit: '/ víkend' },
              { typ: 'auto_mesic', icon: '🚗', title: 'Osobní vůz', sub: 'Měsíční paušál', desc: 'Ideální pro dojíždění. Dlouhodobé bezpečné odstavení.', unit: '/ měsíc' },
            ].map(item => (
              <div key={item.typ} className={`${styles.priceCard} card spotlight`}>
                <div className={styles.pIcon}>{item.icon}</div>
                <div className={styles.pLabel}>{item.title}</div>
                <div className={styles.pSub}>{item.sub}</div>
                <p className={styles.pDesc}>{item.desc}</p>
                <div className={styles.pPrice}>
                  <span className="price-big">{getCena(item.typ)} Kč</span>
                  <span className="price-unit">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Garáže */}
          <h2 className={styles.sectionTitle}>🏢 Pronájem <span className="text-yellow">Garáží</span></h2>

          <div className={`${styles.garazBox} card`}>
            <div className={styles.garazBg} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop')" }} aria-hidden="true" />
            <div className={styles.garazContent}>
              <div className={styles.garazInfo}>
                <h3>XXL Garáž — Kamion / Autobus</h3>
                <ul className={styles.garazList}>
                  <li>Délka 18 m, výška vrat 4,5 m</li>
                  <li>Přípojka elektřina 230V / 400V</li>
                  <li>Montážní jáma pro údržbu</li>
                  <li>Zateplená vrata</li>
                </ul>
              </div>
              <div className={styles.garazPrice}>
                <span className="price-big text-yellow">od {getCena('garaz_najem')} Kč</span>
                <span className="price-unit">/ měsíc</span>
                <a href="tel:+420601223344" className="btn btn-primary" style={{ marginTop: 24 }}>
                  📞 Zavolat dispečink
                </a>
              </div>
            </div>
          </div>

          {/* Plánovaná stavba */}
          <div className={styles.upcoming}>
            <h3>🚧 Plánovaná výstavba nových kójí</h3>
            <p>Připravujeme nové plechové řadové garáže v zadní části areálu. Předběžné rezervace přijímáme emailem.</p>
            <a href="mailto:info@csad-rymarov.cz" className={styles.emailLink}>info@csad-rymarov.cz →</a>
          </div>
        </div>
      </div>
    </>
  )
}

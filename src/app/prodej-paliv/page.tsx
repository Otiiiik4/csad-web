import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import SubpageHero from '@/components/SubpageHero'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Prodej paliv — Uhlí, Pelety, Brikety',
  description: 'Prémiová pevná paliva v areálu CSAD Rýmařov. Hnědé uhlí Ořech 2, dřevěné pelety, brikety a palivové dřevo s rozvozem.',
}

export const revalidate = 60

const STAVBADGE: Record<string, { label: string; cls: string }> = {
  'Skladem':      { label: 'Skladem', cls: 'badge-green' },
  'Poslední kusy':{ label: 'Poslední kusy', cls: 'badge-yellow' },
  'Vyprodáno':    { label: 'Vyprodáno', cls: 'badge-dim' },
}

export default async function ProdejPalivPage() {
  const sb = createServerClient()
  const { data: sklad } = await sb.from('sklad').select('*')

  const items = [
    { typ: 'orech2',  icon: '🔥', title: 'HNĚDÉ UHLÍ',  sub: 'Ořech 2',    desc: 'Frakce 40–100 mm. Vysoká výhřevnost, nízký obsah popele. Rozvoz dodávkou Multicar.' },
    { typ: 'pelety',  icon: '🌿', title: 'DŘEVĚNÉ PELETY', sub: 'Premium',  desc: 'Pelety DIN+ / ENplus A1. Vhodné pro automatické kotle. Dostupné v pytlích i volně ložené.' },
    { typ: 'brikety', icon: '🧱', title: 'BRIKETY',      sub: 'Dřevěné',    desc: 'Dřevěné i uhelné brikety. Snadné skladování, vysoká výhřevnost, minimální popel.' },
  ]

  return (
    <>
      <SubpageHero
        title={<>PRÉMIOVÁ <span style={{ color: 'var(--color-yellow)' }}>PALIVA</span></>}
        subtitle="Uhlí, pelety a brikety s rozvozem přímo k vám."
        bgImage="https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container-md">
        <div className={styles.wrapper}>
          <p className={styles.intro}>
            Prodáváme prémiová pevná paliva pro topné sezóny. Vše skladem, možnost rozvozu dodávkou po okolí Rýmařova.
          </p>

          <div className={styles.fuelGrid}>
            {items.map(item => {
              const record = sklad?.find(s => s.typ === item.typ)
              const stav = record?.stav ?? 'Skladem'
              const badge = STAVBADGE[stav] ?? { label: stav, cls: 'badge-dim' }
              const passive = stav === 'Vyprodáno'
              return (
                <div key={item.typ} className={`${styles.fuelCard} card spotlight ${passive ? 'passive' : ''}`}>
                  <div className={styles.fuelTop}>
                    <span className={styles.fuelIcon}>{item.icon}</span>
                    <span className={`badge ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <h3 className={styles.fuelTitle}>{item.title}</h3>
                  <span className={styles.fuelSub}>{item.sub}</span>
                  <p className={styles.fuelDesc}>{item.desc}</p>
                  {record && !passive && (
                    <div className={styles.fuelPrice}>
                      <span className="price-big text-yellow">{record.cena.toLocaleString('cs-CZ')} Kč</span>
                      <span className="price-unit">/ tuna</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Rozvoz info */}
          <div className={`${styles.deliveryBox} card`}>
            <div className={styles.deliveryIcon}>🚚</div>
            <div>
              <h3 className={styles.deliveryTitle}>Rozvoz Multicar</h3>
              <p className={styles.deliveryDesc}>Zajišťujeme rozvoz paliv přímo k vám domů v okolí Rýmařova. Zavolejte pro domluvu termínu a podmínek dovozu.</p>
              <a href="tel:+420601223344" className={styles.deliveryTel}>📞 +420 601 223 344</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

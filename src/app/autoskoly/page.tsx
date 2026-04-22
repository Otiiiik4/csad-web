import type { Metadata } from 'next'
import SubpageHero from '@/components/SubpageHero'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Autoškoly v areálu',
  description: 'Autoškola Sedláček (osobní auta, motorky, traktory) a Autoškola Mikuš (náklaďáky, autobusy, profesní průkazy) v areálu CSAD Rýmařov.',
}

const SCHOOLS = [
  {
    name: 'AUTOŠKOLA SEDLÁČEK',
    color: 'var(--color-green)',
    desc: 'Výuka a výcvik v kategoriích osobních vozidel, motocyklů a traktorů. Zkušení instruktoři, moderní vozový park.',
    categories: ['🚗 Osobní auta (skupina B)', '🏍️ Motorky (A, A1, A2)', '🚜 Traktory (T)'],
    contact: 'V areálu, budova A',
  },
  {
    name: 'AUTOŠKOLA MIKUŠ',
    color: 'var(--color-blue)',
    desc: 'Specializujeme se na těžkou techniku. Výcvik řidičů nákladních automobilů, autobusů a profesní průkazy CPC.',
    categories: ['🚛 Nákladní vozy (C, C+E)', '🚌 Autobusy (D)', '📋 Profesní průkazy CPC'],
    contact: 'V areálu, budova B',
  },
]

export default function AutoskolyPage() {
  return (
    <>
      <SubpageHero
        title={<>AUTO<span style={{ color: 'var(--color-green)' }}>ŠKOLY</span></>}
        subtitle="Dvě certifikované autoškoly pro všechny kategorie řidičských průkazů."
        bgImage="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="container-md">
        <div className={styles.wrapper}>
          <div className={styles.grid}>
            {SCHOOLS.map(s => (
              <div key={s.name} className={`${styles.schoolCard} card spotlight`} style={{ '--accent': s.color } as React.CSSProperties}>
                <div className={styles.schoolBadge} style={{ background: s.color, color: '#000' }}>Certifikovaná autoškola</div>
                <h2 className={styles.schoolName}>{s.name}</h2>
                <p className={styles.schoolDesc}>{s.desc}</p>
                <div className={styles.schoolCats}>
                  {s.categories.map(c => (
                    <div key={c} className={styles.catItem}>{c}</div>
                  ))}
                </div>
                <div className={styles.schoolContact}>
                  <span>📍 {s.contact}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={`${styles.infoBox} card`}>
            <h3>📞 Kontakt na autoškoly</h3>
            <p>Pro přihlášení a bližší informace se obraťte přímo na jednotlivé autoškoly v areálu nebo nás kontaktujte na recepci.</p>
            <a href="/kontakt" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Napsat dotaz →</a>
          </div>
        </div>
      </div>
    </>
  )
}

import type { Metadata } from 'next'
import SubpageHero from '@/components/SubpageHero'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Dřevo Horáček — Palivové dřevo',
  description: 'Tvrdé i měkké štípané dřevo, metrová kulatina a dřevní odpad v areálu CSAD Rýmařov.',
}

const DREVO = [
  { icon: '🪵', title: 'Tvrdé dřevo', items: ['Dub, buk, habr', 'Výhřevnost 13–15 MJ/kg', 'Ideální pro krby a krbová kamna'] },
  { icon: '🌲', title: 'Měkké dřevo', items: ['Smrk, borovice, jedle', 'Rychlé zapalování', 'Vhodné pro podpal a zahradní ohniště'] },
  { icon: '📏', title: 'Metrová kulatina', items: ['Délka přesně 1 metr', 'Vlastní štípání v ceně', 'Objednávka na míru'] },
]

export default function DrevoPage() {
  return (
    <>
      <SubpageHero
        title={<>DŘEVO <span style={{ color: 'var(--color-yellow)' }}>HORÁČEK</span></>}
        subtitle="Tvrdé i měkké štípané dřevo přímo z areálu. Rychlé vydání, poctivá váha."
        bgImage="https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="container-md">
        <div className={styles.wrapper}>
          <p className={styles.intro}>Pan Horáček nabízí kvalitní palivové dřevo z okolních lesů. Dřevo je řádně vysušené, štípané a připravené k okamžitému použití.</p>
          <div className={styles.grid}>
            {DREVO.map(d => (
              <div key={d.title} className={`${styles.card} card spotlight`}>
                <span className={styles.icon}>{d.icon}</span>
                <h3 className={styles.title}>{d.title}</h3>
                <ul className={styles.list}>
                  {d.items.map(i => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className={`${styles.contactCard} card`}>
            <h3>📞 Objednávky a informace</h3>
            <p>Kontaktujte dispečink areálu nebo přijeďte přímo — dřevo je k dispozici ve skladu v areálu.</p>
            <a href="tel:+420601223344" className={styles.tel}>+420 601 223 344</a>
          </div>
        </div>
      </div>
    </>
  )
}

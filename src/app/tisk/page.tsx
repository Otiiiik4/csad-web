import type { Metadata } from 'next'
import SubpageHero from '@/components/SubpageHero'
import TiskForm from './TiskForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Digitální tisk',
  description: 'Profesionální digitální tisk vizitek, letáků, reklamních plachet a velkoformátového banneru v Rýmařově. Rychle a kvalitně.',
}

const SERVICES = [
  { icon: '📇', title: 'TISK DOKUMENTŮ', accent: 'DOKUMENTŮ', desc: 'Vizitky, letáky, brožury a katalogy. Až 250g papír, matný i lesklý laminát.' },
  { icon: '🖼️', title: 'VELKOFORMÁT', accent: 'FORMÁT', desc: 'Reklamní plachty, roll-upy, plakáty A1 a větší, okenní polepy z PVC fólie.' },
  { icon: '🏷️', title: 'SAMOLEPKY', accent: 'LEPKY', desc: 'Papírové i PVC samolepky, etikety a nálepky s tvarovým ořezem.' },
  { icon: '📚', title: 'VAZBA & DOKONČENÍ', accent: 'DOKONČENÍ', desc: 'Kroužková vazba, laminování, velkokapacitní kopírování a skenování.' },
]

export default function TiskPage() {
  return (
    <>
      <SubpageHero
        title={<>DIGITÁLNÍ <span style={{ color: 'var(--color-blue)' }}>TISK</span></>}
        subtitle="Profesionální tiskový servis pro vaše podnikání i osobní potřebu."
        bgImage="https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=1932&auto=format&fit=crop"
        accentColor="var(--color-blue)"
      />

      <div className="container-md">
        <div className={styles.wrapper}>
          {/* Intro */}
          <p className={styles.intro}>
            Spojujeme nejmodernější digitální technologie s poctivým řemeslem. Rychle, precizně a s ohledem na každý detail — od stovek vizitek po velkoformátové plachty na budovy.
          </p>

          {/* Service cards bento */}
          <div className={styles.bentoGrid}>
            {SERVICES.map((s) => (
              <div key={s.title} className={`${styles.bentoCard} card spotlight`}>
                <span className={styles.bentoIcon}>{s.icon}</span>
                <h3 className={styles.bentoTitle}>{s.title}</h3>
                <p className={styles.bentoDesc}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Order section */}
          <div className={styles.orderGrid} id="formular">
            {/* Info box */}
            <div className={`${styles.infoBox} card`}>
              <h3 className={styles.infoTitle}>📍 KDE NÁS NAJDETE?</h3>
              <p className={styles.infoText}>Přímo v Logistickém areálu CSAD Rýmařov — stačí přijet a zastavit.</p>

              <div className={styles.hoursBlock}>
                <span className={styles.hoursLabel}>Provozní doba</span>
                <span className={styles.hoursVal}>Po–Pá: 8:00–16:00</span>
              </div>

              <a href="tel:+420601223344" className={styles.contactRow}>
                <span>📞</span>
                <strong>+420 601 223 344</strong>
              </a>
              <a href="mailto:tisk@csad-rymarov.cz" className={styles.contactRow}>
                <span>📧</span>
                <strong>tisk@csad-rymarov.cz</strong>
              </a>

              <div className={styles.tipBox}>
                <span className={styles.tipTitle}>💡 PRO TIP</span>
                <p>Pro nejrychlejší nacenění uveďte formát, gramáž materiálu a počet kusů.</p>
              </div>
            </div>

            {/* Form */}
            <TiskForm />
          </div>
        </div>
      </div>
    </>
  )
}

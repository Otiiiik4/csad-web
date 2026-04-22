import type { Metadata } from 'next'
import SubpageHero from '@/components/SubpageHero'
import KontaktForm from './KontaktForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktní informace areálu CSAD Rýmařov. Dispečink, kanceláře a mapa areálu.',
}

export default function KontaktPage() {
  return (
    <>
      <SubpageHero
        title={<>KDE NÁS <span style={{ color: 'var(--color-yellow)' }}>NAJDETE?</span></>}
        subtitle="Jsme přímo na hlavní trase. Snadný vjezd pro kamiony i osobní automobily."
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
      />

      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.grid}>
            {/* LEFT — info + form */}
            <div className={styles.left}>
              <div className={`${styles.infoCard} card`}>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>📞</span>
                  <div>
                    <div className={styles.infoLabel}>Dispečink & Vrátnice</div>
                    <a href="tel:+420601223344" className={styles.infoBig}>+420 601 223 344</a>
                    <div className={styles.infoSub}>Nonstop provoz pro parkování</div>
                  </div>
                </div>
              </div>

              <div className={`${styles.infoCard} card`}>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>📧</span>
                  <div>
                    <div className={styles.infoLabel}>Kanceláře</div>
                    <a href="mailto:info@csad-rymarov.cz" className={styles.infoBig} style={{ fontSize: '1.2rem' }}>info@csad-rymarov.cz</a>
                    <div className={styles.infoSub}>Fakturace a pronájmy</div>
                  </div>
                </div>
              </div>

              <div className={`${styles.infoCard} card`}>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <div className={styles.infoLabel}>Adresa</div>
                    <div className={styles.infoBig} style={{ fontSize: '1.2rem' }}>Žižkova 260/21</div>
                    <div className={styles.infoSub}>795 01 Rýmařov</div>
                  </div>
                </div>
              </div>

              <KontaktForm />
            </div>

            {/* RIGHT — map */}
            <div className={styles.mapBox}>
              <iframe
                src="https://maps.google.com/maps?q=CSAD+Rymarov+Zizkova+260&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 500, borderRadius: 'var(--radius-md)', filter: 'grayscale(100%) invert(90%) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa areálu CSAD Rýmařov"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

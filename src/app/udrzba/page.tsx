import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Probíhá údržba', // root layout doplní " | CSAD Rýmařov"
  description: 'Webové stránky CSAD Rýmařov jsou momentálně ve vývoji. Brzy se vrátíme.',
}

export default function UdrzbaPage() {
  return (
    <div className={styles.container}>
      {/* Animated background orbs */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.orb3} aria-hidden="true" />

      {/* Grid pattern */}
      <div className={styles.gridPattern} aria-hidden="true" />

      {/* Content */}
      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoMark}>C</span>
          <span className={styles.logoText}>SAD</span>
          <span className={styles.logoSub}>RÝMAŘOV</span>
        </div>

        {/* Status badge */}
        <div className={styles.badge}>
          <span className={styles.dot} />
          <span>Ve vývoji</span>
        </div>

        {/* Main heading */}
        <h1 className={styles.title}>
          PRACUJEME NA<br />
          <span className={styles.accent}>NĚČEM NOVÉM</span>
        </h1>

        <p className={styles.subtitle}>
          Naše webové stránky procházejí kompletní modernizací.
          Připravujeme pro vás nový, lepší zážitek.
        </p>

        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
          <span className={styles.progressLabel}>Vývoj probíhá...</span>
        </div>

        {/* Contact info */}
        <div className={styles.contactCard}>
          <p className={styles.contactTitle}>Potřebujete nás kontaktovat?</p>
          <div className={styles.contactGrid}>
            <a href="tel:+420601223344" className={styles.contactLink}>
              <span className={styles.contactIcon}>📞</span>
              <span>+420 601 223 344</span>
            </a>
            <a href="mailto:info@csad-rymarov.cz" className={styles.contactLink}>
              <span className={styles.contactIcon}>📧</span>
              <span>info@csad-rymarov.cz</span>
            </a>
          </div>
          <p className={styles.address}>📍 Žižkova 260/21, 795 01 Rýmařov</p>
        </div>
      </div>

      {/* Bottom bar */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} CSAD Rýmařov. Všechna práva vyhrazena.</p>
      </footer>
    </div>
  )
}

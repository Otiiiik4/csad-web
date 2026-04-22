import Link from 'next/link'
import styles from './Footer.module.css'

interface FooterProps {
  telefon: string
  email: string
}

const LINKS = [
  { href: '/tisk',             label: 'Digitální tisk' },
  { href: '/cerpaci-stanice',  label: 'Čerpací stanice' },
  { href: '/parkovani-garaze', label: 'Parkování & Garáže' },
  { href: '/hudebni-klub',     label: 'Klub Proxy' },
  { href: '/autoskoly',        label: 'Autoškoly' },
  { href: '/prodej-paliv',     label: 'Uhlí & Pelety' },
  { href: '/drevo-horacek',    label: 'Dřevo Horáček' },
  { href: '/napojove-centrum', label: 'Nápojové centrum' },
  { href: '/kontakt',          label: 'Kontakt' },
]

export default function Footer({ telefon, email }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>C</span>
            <span className={styles.logoText}>SAD</span>
            <span className={styles.logoSub}>Rýmařov</span>
          </div>
          <p className={styles.tagline}>
            Centrum služeb, podnikání a zábavy<br />
            v srdci Rýmařova.
          </p>
          <div className={styles.contacts}>
            <a href={`tel:${telefon.replace(/\s/g, '')}`} className={styles.contactItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.1 19.79 19.79 0 0 1 1.61 2.48 2 2 0 0 1 3.58.34h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {telefon}
            </a>
            <a href={`mailto:${email}`} className={styles.contactItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {email}
            </a>
          </div>
        </div>

        {/* Links */}
        <div className={styles.linksSection}>
          <h3 className={styles.linksTitle}>Naše služby</h3>
          <ul className={styles.linksList}>
            {LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={styles.link}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Address */}
        <div className={styles.address}>
          <h3 className={styles.linksTitle}>Kde nás najdete</h3>
          <address className={styles.addressBlock}>
            <strong>Areál CSAD</strong><br />
            Žižkova 260/21<br />
            795 01 Rýmařov
          </address>
          <p className={styles.hours}>
            <span className={styles.hoursLabel}>Kanceláře:</span><br />
            Po–Pá: 8:00–16:00
          </p>
          <p className={styles.hours}>
            <span className={styles.hoursLabel}>Čerpací stanice:</span><br />
            <span className="text-yellow">NONSTOP</span>
          </p>
          <Link href="/admin" className={styles.adminLink}>
            Admin
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <span>© {new Date().getFullYear()} Logistický areál CSAD Rýmařov. Všechna práva vyhrazena.</span>
        </div>
      </div>
    </footer>
  )
}

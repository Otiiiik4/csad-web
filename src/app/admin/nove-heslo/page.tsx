import type { Metadata } from 'next'
import NoveHesloForm from './NoveHesloForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Nové heslo',
  robots: { index: false },
}

export default function NoveHesloPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span style={{ color: 'var(--color-yellow)' }}>C</span>SAD
        </div>
        <h1 className={styles.title}>Nastavení hesla</h1>
        <p className={styles.sub}>Zvolte si nové heslo pro přístup do správy areálu.</p>
        <NoveHesloForm />
      </div>
    </div>
  )
}

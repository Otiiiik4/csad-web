import type { Metadata } from 'next'
import AdminLoginForm from './AdminLoginForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Admin přihlášení',
  robots: { index: false },
}

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span style={{ color: 'var(--color-yellow)' }}>C</span>SAD
        </div>
        <h1 className={styles.title}>Správa areálu</h1>
        <p className={styles.sub}>Přihlaste se pro přístup do řídícího panelu.</p>
        <AdminLoginForm />
      </div>
    </div>
  )
}

import Link from 'next/link'
import styles from './LockedService.module.css'

export default function LockedService({ title }: { title: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <div className={styles.icon}>🔒</div>
        <h1 className={styles.title}>Uzamčeno</h1>
        <h2 className={styles.subtitle}>Služba {title} je momentálně nedostupná.</h2>
        <p className={styles.text}>
          Omlouváme se, ale tato sekce webu byla dočasně deaktivována administrátorem. Zkuste to prosím později.
        </p>
        <Link href="/" className="btn btn-primary">
          Zpět na hlavní bránu
        </Link>
      </div>
    </div>
  )
}

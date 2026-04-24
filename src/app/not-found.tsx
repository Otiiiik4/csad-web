import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Tato cesta nikam nevede.</h2>
        <p className={styles.text}>
          Stránka, kterou hledáte, se v areálu nenachází. Možná byla přesunuta, nebo jste zadali špatnou adresu.
        </p>
        <Link href="/" className="btn btn-primary">
          Zpět na hlavní bránu
        </Link>
      </div>
    </div>
  )
}

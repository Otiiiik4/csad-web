import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner} />
      </div>
      <div className={styles.text}>Načítání obsahu...</div>
      
      <div className={styles.skeletonGrid}>
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>
    </div>
  )
}

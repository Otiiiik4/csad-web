import styles from './AnnouncementBar.module.css'

export default function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className={styles.bar} role="banner">
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.text}>{text}</span>
    </div>
  )
}

import styles from './MottoSection.module.css'

export default function MottoSection() {
  return (
    <section className={styles.motto}>
      <div className="container-md">
        <p className={styles.text}>
          VÍC NEŽ LOGISTIKA.{' '}
          <span className={styles.accent}>KOMPLEXNÍ ZÁZEMÍ</span>{' '}
          PRO VAŠE PODNIKÁNÍ.
        </p>
      </div>
    </section>
  )
}

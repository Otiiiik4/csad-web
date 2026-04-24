'use client'

import styles from './Marquee.module.css'

export default function Marquee() {
  const items = [
    'DIGITÁLNÍ TISK', 'ČERPÁCÍ STANICE NONSTOP', 'KLUB PROXY',
    'PARKOVÁNÍ TIR', 'DOPRAVNÍ PSYCHOLOG', 'AUTOSERVIS',
    'NÁPOJOVÉ CENTRUM', 'DŘEVO HORÁČEK', 'STAS RÝMAŘOV'
  ]

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        <div className={styles.marqueeContent}>
          {items.map((item, i) => (
            <span key={i}>
              {item} <span className={styles.dot}>•</span>
            </span>
          ))}
        </div>
        <div className={styles.marqueeContent} aria-hidden="true">
          {items.map((item, i) => (
            <span key={`clone-${i}`}>
              {item} <span className={styles.dot}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

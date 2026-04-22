import styles from './SubpageHero.module.css'

interface Props {
  title: React.ReactNode
  subtitle?: string
  bgImage: string
  accentColor?: string
}

export default function SubpageHero({ title, subtitle, bgImage, accentColor }: Props) {
  return (
    <div className="subpage-hero">
      <div
        className="subpage-hero-bg"
        style={{ backgroundImage: `url('${bgImage}')` }}
        aria-hidden="true"
      />
      <div className="subpage-hero-overlay" aria-hidden="true" />
      <div className="subpage-hero-content">
        <h1 className={styles.title} style={accentColor ? { '--accent': accentColor } as React.CSSProperties : {}}>
          {title}
        </h1>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
      </div>
    </div>
  )
}

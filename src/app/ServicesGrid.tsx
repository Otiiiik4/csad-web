import Link from 'next/link'
import styles from './ServicesGrid.module.css'

interface ServiceCardBigProps {
  href: string
  icon: string
  title: string
  desc: string
  label: string
  badge?: { text: string; color: 'yellow' | 'blue' | 'pink' | 'green' }
  accentColor?: string
  active: boolean
  delay?: number
}

function ServiceCardBig({ href, icon, title, desc, label, badge, accentColor, active, delay = 0 }: ServiceCardBigProps) {
  const style: React.CSSProperties = {
    transitionDelay: `${delay}ms`,
    ...(active && accentColor ? { borderBottomColor: accentColor } : {}),
  }
  if (!active) {
    return (
      <div className={`${styles.cardBig} card passive`} style={style}>
        <div className={styles.cardIcon}>{icon}</div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{desc}</p>
        <span className={`badge badge-dim ${styles.cardLabel}`}>(Připravujeme)</span>
      </div>
    )
  }
  return (
    <Link href={href} className={`${styles.cardBig} card card-hover spotlight ${active && accentColor ? styles.accentBottom : ''}`} style={style}>
      {badge && <span className={`badge badge-${badge.color} ${styles.cardBadge}`}>{badge.text}</span>}
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
      <span className={styles.cardLabel} style={accentColor ? { color: accentColor } : {}}>{label} →</span>
    </Link>
  )
}

interface ServiceCardSmallProps {
  href: string
  icon: string
  title: string
  subtitle: string
  active: boolean
  external?: boolean
  delay?: number
  accentBorder?: string
  accentTitle?: string
}

function ServiceCardSmall({ href, icon, title, subtitle, active, external, delay = 0, accentBorder, accentTitle }: ServiceCardSmallProps) {
  const style: React.CSSProperties = {
    transitionDelay: `${delay}ms`,
    ...(accentBorder ? { borderColor: accentBorder } : {}),
  }
  if (!active) {
    return (
      <div className={`${styles.cardSmall} card passive`} style={style}>
        <span className={styles.iconSmall}>{icon}</span>
        <div>
          <h3 className={styles.smallTitle}>{title}</h3>
          <span className={styles.smallSub}>(Připravujeme)</span>
        </div>
      </div>
    )
  }
  return (
    <Link
      href={href}
      className={`${styles.cardSmall} card card-hover spotlight`}
      style={style}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className={styles.iconSmall}>{icon}</span>
      <div>
        <h3 className={styles.smallTitle} style={accentTitle ? { color: accentTitle } : {}}>{title}</h3>
        <span className={styles.smallSub}>{subtitle}{external ? ' ↗' : ''}</span>
      </div>
    </Link>
  )
}

interface Props {
  isActive: (kod: string) => boolean
  dieselPrice?: number
}

export default function ServicesGrid({ isActive, dieselPrice }: Props) {
  return (
    <div className={styles.wrapper}>

      {/* TOP SECTION LABEL */}
      <div className="cat-title" style={{ marginBottom: 32 }}>⭐ Hlavní služby areálu</div>

      {/* BIG CARDS GRID */}
      <div className={styles.bigGrid}>
        <ServiceCardBig
          href="/tisk"
          icon="🖨️"
          title="DIGITÁLNÍ TISK"
          desc="Vizitky, bannery, letáky. Profi kvalita na počkání."
          label="Poptat tisk"
          badge={{ text: 'Novinka', color: 'blue' }}
          accentColor="var(--color-blue)"
          active={isActive('tisk')}
          delay={0}
        />
        <ServiceCardBig
          href="/cerpaci-stanice"
          icon="⛽"
          title="ČERPACÍ STANICE"
          desc={dieselPrice ? `Nafta ${dieselPrice.toLocaleString('cs-CZ')} Kč/l · Benzín · AdBlue` : 'Nafta, Benzín, AdBlue. Kvalitní paliva.'}
          label="Ceník paliv"
          badge={{ text: 'NONSTOP', color: 'yellow' }}
          active={isActive('phm')}
          delay={80}
        />
        <ServiceCardBig
          href="/parkovani-garaze"
          icon="🚛"
          title="PARKOVÁNÍ TIR"
          desc="Hlídaný areál pro kamiony. Garáže XXL s montážní jámou."
          label="Zjistit ceny"
          active={isActive('parkovani')}
          delay={160}
        />
        <ServiceCardBig
          href="/hudebni-klub"
          icon="🎸"
          title="KLUB PROXY"
          desc="Koncerty a párty. Profesionální zvuk a bar."
          label="Program klubu"
          badge={{ text: 'Akce', color: 'pink' }}
          accentColor="var(--color-pink)"
          active={isActive('klub')}
          delay={240}
        />
      </div>

      {/* DIVIDER */}
      <hr className="divider" />

      {/* DOPRAVA */}
      <div className="cat-title">🚛 Doprava a motoristé</div>
      <div className={styles.smallGrid}>
        <ServiceCardSmall href="/autoskoly" icon="🚗" title="AUTOŠKOLY" subtitle="Sedláček & Mikuš" active={isActive('autoskoly')} delay={0} />
        <ServiceCardSmall href="https://www.petr-vala.cz/" icon="🧠" title="PETR VALA" subtitle="Dopravní psycholog" active={isActive('vala')} external delay={60} />
        <ServiceCardSmall href="https://www.verdatex.cz" icon="📦" title="SPEDICE VERDATEX" subtitle="Kamionová doprava" active={isActive('verdatex')} external delay={120} />
        <ServiceCardSmall href="#" icon="🔧" title="AUTOSERVIS" subtitle="Opravy vozidel" active={isActive('autoservis')} delay={180} />
        <ServiceCardSmall href="#" icon="💨" title="EMISE A STK" subtitle="Měření emisí" active={isActive('emise')} delay={240} />
      </div>

      {/* DIVIDER */}
      <hr className="divider" />

      {/* ENERGIE */}
      <div className="cat-title">🏠 Energie a stavba</div>
      <div className={styles.smallGrid}>
        <ServiceCardSmall href="/prodej-paliv" icon="🔥" title="PRÉMIOVÁ PALIVA" subtitle="Pelety a Uhlí" active={isActive('uhli')} delay={0} accentBorder="var(--color-yellow)" accentTitle="var(--color-yellow)" />
        <ServiceCardSmall href="/drevo-horacek" icon="🪵" title="DŘEVO HORÁČEK" subtitle="Štípané dřevo" active={isActive('drevo')} delay={60} />
        <ServiceCardSmall href="https://www.stas-rymarov.cz" icon="🏗️" title="STAS RÝMAŘOV" subtitle="Stavební činnost" active={isActive('stas')} external delay={120} />
        <ServiceCardSmall href="#" icon="⚡" title="PROJEKCE FVE" subtitle="Solární systémy" active={isActive('fve')} delay={180} />
      </div>

      {/* DIVIDER */}
      <hr className="divider" />

      {/* OSTATNÍ */}
      <div className="cat-title">🏢 Ostatní firmy v areálu</div>
      <div className={styles.smallGrid}>
        <ServiceCardSmall href="/napojove-centrum" icon="🥤" title="NÁPOJOVÉ CENTRUM" subtitle="Velkoobchod & Maloobchod" active={isActive('napoje')} delay={0} />
        <ServiceCardSmall href="https://www.cetin.cz" icon="📡" title="CETIN" subtitle="Telekomunikace" active={isActive('cetin')} external delay={60} />
        <ServiceCardSmall href="#" icon="📍" title="DALŠÍ NÁJEMCI" subtitle="Kanceláře a sklady" active={isActive('najemci')} delay={120} />
      </div>

    </div>
  )
}

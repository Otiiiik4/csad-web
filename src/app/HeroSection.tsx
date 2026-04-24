'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!bgRef.current || !contentRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      bgRef.current.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px) scale(1.05)`
      contentRef.current.style.transform = `translate(${-x * 0.1}px, ${-y * 0.1}px)`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className={styles.hero}>
      {/* Background Video with parallax */}
      <video
        ref={bgRef as any}
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
        poster="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
      >
        <source src="https://cdn.coverr.co/videos/coverr-driving-a-truck-on-a-highway-4914/1080p.mp4" type="video/mp4" />
      </video>
      {/* Overlays */}
      <div className={styles.overlayGrad} aria-hidden="true" />
      <div className={styles.overlayNoise} aria-hidden="true" />

      {/* Orbs */}
      <div className={`${styles.orb} ${styles.orbBlue}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orbYellow}`} aria-hidden="true" />

      {/* Content */}
      <div ref={contentRef} className={styles.content}>
        <div className={styles.eyebrow}>
          <span className="pulse-dot" />
          <span>Areál v provozu</span>
        </div>

        <h1 className={styles.title}>
          LOGISTICKÝ<br />
          AREÁL&nbsp;<span className={styles.titleAccent}>CSAD</span>
        </h1>

        <p className={styles.subtitle}>
          Centrum služeb, podnikání a zábavy v Rýmařově.
          <br className={styles.br} />
          Vše pod jednou střechou.
        </p>

        <div className={styles.ctas}>
          <Link href="/tisk" className="btn btn-primary">
            🖨️ Poptat tisk
          </Link>
          <Link href="/cerpaci-stanice" className="btn btn-secondary">
            ⛽ Čerpací stanice
          </Link>
          <Link href="/parkovani-garaze" className="btn btn-secondary">
            🚛 Parkování TIR
          </Link>
        </div>

        {/* Quick stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>NONSTOP</span>
            <span className={styles.statLabel}>Čerpací stanice</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true" />
          <div className={styles.stat}>
            <span className={styles.statNum}>24/7</span>
            <span className={styles.statLabel}>Hlídaný areál</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true" />
          <div className={styles.stat}>
            <span className={styles.statNum}>10+</span>
            <span className={styles.statLabel}>Služeb na místě</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  )
}

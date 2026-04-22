'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { href: '/tisk',            label: 'Tisk' },
  { href: '/cerpaci-stanice', label: 'Čerpací stanice' },
  { href: '/parkovani-garaze', label: 'Parkování' },
  { href: '/hudebni-klub',    label: 'Klub Proxy' },
  { href: '/kontakt',         label: 'Kontakt' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} ref={menuRef}>
      {/* Scroll progress bar */}
      <div className={styles.progressBar} style={{ width: `${progress}%` }} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.logoMark}>C</span>
          <span className={styles.logoText}>SAD</span>
          <span className={styles.logoSub}>RÝMAŘOV</span>
        </Link>

        {/* Desktop nav links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={styles.link}>{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="/tisk" className={`btn btn-primary ${styles.cta}`}>
          Poptat tisk
        </Link>

        {/* Hamburger */}
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Otevřít menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`}>
        {NAV_LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={styles.mobileLink}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/tisk" className="btn btn-primary" onClick={() => setOpen(false)}>
          Poptat tisk
        </Link>
      </div>
    </nav>
  )
}

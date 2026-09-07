'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './GarazePopup.module.css'

/** Zvyš verzi v klíči, až budeš chtít popup ukázat znovu i těm, kdo ho zavřeli. */
const STORAGE_KEY = 'csad_garaze_popup_v1'

/** Událost, kterou pošle CookieBanner po odsouhlasení — ať nevybafnou obě naráz. */
const CONSENT_EVENT = 'csad:cookie-consent'
const CONSENT_KEY = 'csad_cookie_consent'

/** Promo nemá co dělat na údržbě ani v interní správě. */
const HIDDEN_ON = ['/udrzba', '/admin', '/profil', '/registrace']

const VYHODY = [
  { icon: '🕐', title: 'Přístup 24/7', text: 'Do areálu se dostanete 24 hodin denně, 7 dní v týdnu.' },
  { icon: '⚡', title: 'Elektřina v každé garáži', text: 'Každá garáž bude mít vlastní přívod elektřiny.' },
  { icon: '📹', title: 'Monitorováno', text: 'Uzavřený areál střežený kamerovým systémem.' },
]

const VHODNE_PRO = ['🚗 Auta', '🏍️ Motocykly', '📦 Skladování']

/** Bezpečné čtení localStorage — v anonymním okně může vyhodit výjimku. */
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export default function GarazePopup() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'seen')
    } catch {
      // Neuložilo se — popup se příště ukáže znovu, což nevadí
    }
    setShow(false)
  }, [])

  // Kdy popup otevřít
  useEffect(() => {
    if (HIDDEN_ON.some(p => pathname === p || pathname.startsWith(`${p}/`))) return
    if (readStorage(STORAGE_KEY)) return // návštěvník už ho jednou zavřel

    let timer: ReturnType<typeof setTimeout>
    const openAfter = (delay: number) => {
      timer = setTimeout(() => setShow(true), delay)
    }

    // Cookie lišta má přednost. Když ještě nebyla odsouhlasená, počkáme na ni,
    // aby se návštěvníkovi neotevřely dvě věci přes sebe.
    if (readStorage(CONSENT_KEY)) {
      openAfter(2500)
    } else {
      window.addEventListener(CONSENT_EVENT, () => openAfter(900), { once: true })
    }

    return () => clearTimeout(timer)
  }, [pathname])

  // Zavření Escapem, zámek scrollu a návrat fokusu
  useEffect(() => {
    if (!show) return

    lastFocused.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden' // zastaví i Lenis smooth scroll
    root.classList.add('modal-open') // schová plovoucí Navi pod overlayem

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.style.overflow = prevOverflow
      root.classList.remove('modal-open')
      lastFocused.current?.focus()
    }
  }, [show, dismiss])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={dismiss}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="garaze-popup-title"
            tabIndex={-1}
            className={styles.dialog}
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.close} onClick={dismiss} aria-label="Zavřít oznámení">
              ✕
            </button>

            <div className={styles.header}>
              <span className={`badge badge-yellow ${styles.badge}`}>
                🏗️ Výstavba se plánuje
              </span>

              <h2 id="garaze-popup-title" className={styles.title}>
                Nové zděné <span className={styles.accent}>garáže</span>
                <br />k pronájmu
              </h2>

              <p className={styles.location}>
                <span aria-hidden="true">📍</span> Žižkova 260/21 — areál ČSAD v Rýmařově
              </p>

              <p className={styles.lead}>
                Kvalitní a bezpečné garáže v uzavřeném a monitorovaném areálu.
                Vhodné pro parkování vozidel, uskladnění věcí, nářadí nebo firemního vybavení.
              </p>
            </div>

            <ul className={styles.features}>
              {VYHODY.map(v => (
                <li key={v.title} className={styles.feature}>
                  <span className={styles.featureIcon} aria-hidden="true">{v.icon}</span>
                  <div>
                    <strong className={styles.featureTitle}>{v.title}</strong>
                    <span className={styles.featureText}>{v.text}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.chipsRow}>
              <span className={styles.chipsLabel}>Ideální pro</span>
              <div className={styles.chips}>
                {VHODNE_PRO.map(c => (
                  <span key={c} className={styles.chip}>{c}</span>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/kontakt" className="btn btn-primary" onClick={dismiss}>
                Mám zájem →
              </Link>
              <button onClick={dismiss} className="btn btn-ghost">
                Teď ne
              </button>
            </div>

            <p className={styles.note}>
              Přesný termín dokončení bude upřesněn. Fotky na letáku jsou ilustrační.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

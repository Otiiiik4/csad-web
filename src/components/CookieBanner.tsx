'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import styles from './CookieBanner.module.css'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Zkontrolujeme, zda už uživatel odsouhlasil
    const consent = localStorage.getItem('csad_cookie_consent')
    if (!consent) {
      // Menší zpoždění, aby to nevybaflo hned při první animaci stránky
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('csad_cookie_consent', 'accepted')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className={styles.banner}
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className={styles.content}>
            <div className={styles.icon}>🍪</div>
            <div className={styles.textContainer}>
              <p className={styles.title}>Vážíme si vašeho soukromí</p>
              <p className={styles.text}>
                Tento web používá soubory cookies k zajištění správného fungování (např. přihlášení a správa relací) a k vylepšování uživatelského zážitku. 
                Pokračováním v prohlížení souhlasíte s jejich použitím.
              </p>
            </div>
          </div>
          <div className={styles.actions}>
            <button onClick={accept} className="btn btn-primary">
              Rozumím a souhlasím
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

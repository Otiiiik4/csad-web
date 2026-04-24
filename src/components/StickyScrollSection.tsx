'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import styles from './StickyScrollSection.module.css'

const CONTENT = [
  {
    title: <>Nekonečné možnosti<br/>v srdci Jeseníků.</>,
    text: "Logistický areál, který se přizpůsobí vašemu byznysu i volnému času.",
    bg: "url(https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000&auto=format&fit=crop)"
  },
  {
    title: <>Paliva, Parkování,<br/>Kompletní Servis.</>,
    text: "Jsme tu pro vás NONSTOP. Vaše vozy jsou u nás v bezpečí a vždy připravené vyrazit.",
    bg: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2000&auto=format&fit=crop)"
  },
  {
    title: <>A mnohem více.</>,
    text: "Od tisku přes dopravního psychologa až po skvělou kávu a hudbu.",
    bg: "url(https://images.unsplash.com/photo-1473445730015-841f29a9490b?q=80&w=2000&auto=format&fit=crop)"
  }
]

export default function StickyScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 0.0 - 0.25 (1/4 scrollu) - První sekce
    if (latest < 0.25) setActiveIndex(0)
    // 0.25 - 0.75 (2/4 scrollu) - Prostřední sekce (nyní je 2x delší)
    else if (latest < 0.75) setActiveIndex(1)
    // 0.75 - 1.0 (1/4 scrollu) - Třetí sekce
    else setActiveIndex(2)
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section ref={targetRef} className={styles.container}>
      <div className={styles.stickyContent}>
        
        {/* Background Visuals */}
        <div className={styles.visuals}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              className={styles.bgImage} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{ 
                backgroundImage: CONTENT[activeIndex].bg,
                scale
              }} 
            />
          </AnimatePresence>
          <div className={styles.overlay} />
        </div>

        {/* Text Content */}
        <div className={styles.textContent}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              className={styles.textBlock}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h2>{CONTENT[activeIndex].title}</h2>
              <p>{CONTENT[activeIndex].text}</p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}

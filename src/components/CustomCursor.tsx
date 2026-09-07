'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './CustomCursor.module.css'

/* Detekce ukazovacího zařízení přes useSyncExternalStore — na rozdíl od
   setState v efektu nezpůsobí druhý průchod renderem a korektně reaguje,
   když uživatel přepne z dotyku na myš (hybridní notebooky). */
const COARSE_POINTER = '(pointer: coarse)'

const subscribePointer = (onChange: () => void) => {
  const mq = window.matchMedia(COARSE_POINTER)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

const hasMouse = () => !window.matchMedia(COARSE_POINTER).matches
const hasMouseOnServer = () => false // při SSR kurzor nevykreslujeme

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const isVisible = useSyncExternalStore(subscribePointer, hasMouse, hasMouseOnServer)

  // Pevný středový bod
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  // Zpožděný "magnetický" prstenec
  const ringX = useMotionValue(-100)
  const ringY = useMotionValue(-100)
  
  // Jemné tlumení (spring)
  const springRingX = useSpring(ringX, { stiffness: 400, damping: 28, mass: 0.5 })
  const springRingY = useSpring(ringY, { stiffness: 400, damping: 28, mass: 0.5 })

  useEffect(() => {
    // Posluchače věšíme jen na zařízeních s myší
    if (!isVisible) return

    const mousePos = { x: -100, y: -100 }

    const checkHover = () => {
      // Během scrollování kontrolujeme, co je pod kurzorem
      const target = document.elementFromPoint(mousePos.x, mousePos.y) as HTMLElement
      if (!target) return

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('.spotlight')
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    const moveCursor = (e: MouseEvent) => {
      mousePos.x = e.clientX
      mousePos.y = e.clientY

      mouseX.set(e.clientX - 4) // 8px dot size -> offset 4
      mouseY.set(e.clientY - 4)
      ringX.set(e.clientX - 20) // 40px ring size -> offset 20
      ringY.set(e.clientY - 20)
      
      checkHover()
    }

    const handleScroll = () => {
      checkHover()
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isVisible, mouseX, mouseY, ringX, ringY])

  if (!isVisible) return null

  return (
    <>
      <motion.div
        className={styles.cursorDot}
        style={{ x: mouseX, y: mouseY }}
      />
      <motion.div
        className={`${styles.cursorRing} ${isHovered ? styles.hovered : ''}`}
        style={{ x: springRingX, y: springRingY }}
      />
    </>
  )
}

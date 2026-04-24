'use client'

import { motion } from 'framer-motion'
import { useUISounds } from '@/hooks/useUISounds'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const { playSound } = useUISounds()
  const pathname = usePathname()

  useEffect(() => {
    // Play transition sound on page mount
    playSound('transition')
  }, [pathname, playSound])

  return (
    <>
      {/* Opona, která vyjede nahoru (odhalí novou stránku) */}
      <motion.div
        initial={{ height: '100vh', top: 0 }}
        animate={{ height: 0, top: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          background: '#040814',
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: '0px 20px 40px rgba(0,0,0,0.8)' // stín pod oponou
        }}
      />
      
      {/* Vlastní obsah stránky, který plynule najede zespodu */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1], // Cinematic feeling
          delay: 0.1 
        }}
      >
        {children}
      </motion.div>
    </>
  )
}

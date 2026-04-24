'use client'

import { useEffect, useRef } from 'react'
import { useUISounds } from '@/hooks/useUISounds'

export default function InteractionProvider() {
  const { playSound } = useUISounds()
  const lastHoveredRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Elements that should trigger a hover sound
      const interactable = target.closest('a, button, .card, input, select') as HTMLElement
      
      if (interactable && interactable !== lastHoveredRef.current) {
        playSound('hover')
        lastHoveredRef.current = interactable
      } else if (!interactable) {
        lastHoveredRef.current = null
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, input[type="submit"]')) {
        playSound('click')
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('click', handleClick)
    }
  }, [playSound])

  return null
}

'use client'

import { useCallback, useRef, useEffect } from 'react'

export function useUISounds() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }
    window.addEventListener('click', initAudio, { once: true })
    window.addEventListener('keydown', initAudio, { once: true })
    return () => {
      window.removeEventListener('click', initAudio)
      window.removeEventListener('keydown', initAudio)
    }
  }, [])

  const playSound = useCallback((type: 'hover' | 'click' | 'transition') => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    const now = ctx.currentTime

    if (type === 'hover') {
      // Very subtle, premium tick
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.02)
      
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.015, now + 0.005)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
      
      osc.start(now)
      osc.stop(now + 0.03)
    } 
    else if (type === 'click') {
      // Satisfying mechanical clack
      osc.type = 'square'
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.05)
      
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.05, now + 0.005)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)
      
      osc.start(now)
      osc.stop(now + 0.05)
    }
    else if (type === 'transition') {
      // Cinematic low frequency whoosh
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(40, now)
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.3)
      
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
      
      osc.start(now)
      osc.stop(now + 0.3)
    }
  }, [])

  return { playSound }
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { askNavi } from '@/actions/navi'
import { useUISounds } from '@/hooks/useUISounds'
import styles from './NaviAssistant.module.css'

type Message = {
  id: string
  role: 'user' | 'navi'
  content: string
}

// Pomocná funkce na parsování jednoduchého markdownu (tučné písmo a odřádkování)
function formatMessage(content: string) {
  const lines = content.split('\n')
  return lines.map((line, i) => {
    // Nahradíme **text** za <strong>text</strong>
    const parts = line.split(/(\*\*.*?\*\*)/g)
    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className={styles.bold}>{part.slice(2, -2)}</strong>
          }
          return part
        })}
        {i < lines.length - 1 && <br />}
      </span>
    )
  })
}

export default function NaviAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'navi', content: 'Dobrý den! Jsem **Navi**, virtuální dispečer CSAD. Zajímá vás cena nafty, parkování nebo něco dalšího?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { playSound } = useUISounds()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false) // Skryjeme bublinu při otevření
      scrollToBottom()
      playSound('transition')
    }
  }, [isOpen, messages, playSound])

  useEffect(() => {
    // Pozdrav se ukáže za 3 vteřiny
    const timer = setTimeout(() => {
      if (!isOpen) setShowGreeting(true)
    }, 3000)

    // A zmizí za 10 vteřin
    const hideTimer = setTimeout(() => {
      setShowGreeting(false)
    }, 10000)

    return () => { clearTimeout(timer); clearTimeout(hideTimer) }
  }, [isOpen])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim()) return

    const userText = inputValue.trim()
    setInputValue('')
    
    // Přidáme zprávu uživatele
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: userText }
    setMessages(prev => [...prev, newMsg])
    setIsTyping(true)

    // Simulujeme lehké zpoždění pro přirozenější pocit (bot "přemýšlí")
    setTimeout(async () => {
      try {
        const reply = await askNavi(userText)
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'navi', content: reply }])
      } catch (err) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'navi', content: 'Došlo k výpadku mého spojení s dispečinkem. Zkuste to za chvíli.' }])
      } finally {
        setIsTyping(false)
        playSound('transition')
      }
    }, 600 + Math.random() * 500)
  }

  return (
    <div className={styles.container}>
      {/* Plovoucí orb */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.triggerButton}
            onClick={() => setIsOpen(true)}
            data-lenis-prevent="true"
          >
            <div className={styles.orbCore} />
            <div className={styles.orbRing} />
            <div className={styles.orbRing2} />
            <span className={styles.naviLabel}>NAVI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Uvítací bublina (zobrazí se chvíli po načtení) */}
      <AnimatePresence>
        {!isOpen && showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={styles.greetingBubble}
          >
            Dobrý den! 👋 Můžu nějak poradit?
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(5px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={styles.chatWindow}
            data-lenis-prevent="true"
          >
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.avatar}>N</div>
                <div>
                  <h3 className={styles.name}>Navi</h3>
                  <p className={styles.status}>
                    <span className={styles.statusDot} />
                    Digitální dispečer
                  </p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className={styles.messagesArea} data-lenis-prevent="true">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.wrapperUser : styles.wrapperNavi}`}
                >
                  <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleNavi}`}>
                    {formatMessage(msg.content)}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className={`${styles.messageWrapper} ${styles.wrapperNavi}`}
                >
                  <div className={`${styles.bubble} ${styles.bubbleNavi} ${styles.typingBubble}`}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className={styles.inputArea}>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Zeptejte se na ceny paliv..."
                className={styles.input}
              />
              <button type="submit" className={styles.sendBtn} disabled={!inputValue.trim()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

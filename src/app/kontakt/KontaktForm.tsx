'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './KontaktForm.module.css'

export default function KontaktForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('zpravy').insert([{
      jmeno: fd.get('jmeno'),
      email: fd.get('email'),
      text: fd.get('text'),
    }])
    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <div className={`${styles.box} card`}>
      <h2 className={styles.title}>Napište nám</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="form-group">
          <label className="form-label">Vaše jméno</label>
          <input className="form-input" type="text" name="jmeno" placeholder="Jan Novák" required />
        </div>
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input className="form-input" type="email" name="email" placeholder="jan@firma.cz" required />
        </div>
        <div className="form-group">
          <label className="form-label">Zpráva</label>
          <textarea className="form-input" name="text" rows={4} placeholder="Mám zájem o dlouhodobý pronájem…" required style={{ resize: 'vertical' }} />
        </div>
        <button type="submit" className={styles.submit} disabled={status === 'loading'}>
          {status === 'loading' ? 'Odesílám…' : 'Odeslat zprávu →'}
        </button>
        {status === 'success' && <div className="status-msg success">✅ Zpráva odeslána!</div>}
        {status === 'error'   && <div className="status-msg error">❌ Chyba. Zkuste to znovu.</div>}
      </form>
    </div>
  )
}

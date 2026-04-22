'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './TiskForm.module.css'

export default function TiskForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('poptavky_tisk').insert([{
      jmeno: fd.get('jmeno'),
      email: fd.get('email'),
      telefon: fd.get('telefon'),
      typ_zakazky: fd.get('typ_zakazky'),
      popis: fd.get('popis'),
    }])
    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
      setTimeout(() => setStatus('idle'), 6000)
    }
  }

  return (
    <div className={`${styles.formBox} card`}>
      <h2 className={styles.formTitle}>
        NEZÁVAZNÁ <span style={{ color: 'var(--color-blue)' }}>POPTÁVKA</span>
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row2}>
          <div className="form-group">
            <label className="form-label">Jméno nebo Firma</label>
            <input className="form-input" type="text" name="jmeno" placeholder="Jan Novák" required />
          </div>
          <div className="form-group">
            <label className="form-label">Telefon</label>
            <input className="form-input" type="tel" name="telefon" placeholder="+420…" required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input className="form-input" type="email" name="email" placeholder="vas@email.cz" required />
        </div>

        <div className="form-group">
          <label className="form-label">O co se jedná?</label>
          <select className="form-select" name="typ_zakazky">
            <option value="Vizitky/Letáky">Tiskoviny (Vizitky, Letáky)</option>
            <option value="Velkoformát/Banner">Velkoformát (Bannery, Plakáty)</option>
            <option value="Samolepky">Samolepky / Štítky</option>
            <option value="Jiné">Jiné (Kopírování, Vazba, Mix)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Specifikace</label>
          <textarea
            className="form-input"
            name="popis"
            rows={4}
            placeholder="Např.: 500 ks vizitek, oboustranný tisk, tvrdý papír 350g…"
            required
            style={{ resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Zpracovávám…' : 'Odeslat k nacenění →'}
        </button>

        {status === 'success' && (
          <div className="status-msg success">✓ Poptávka přijata! Brzy se vám ozveme.</div>
        )}
        {status === 'error' && (
          <div className="status-msg error">❌ Chyba odeslání. Zkuste to znovu.</div>
        )}
      </form>
    </div>
  )
}

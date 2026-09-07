'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './AdminLoginForm.module.css'

type Rezim = 'prihlaseni' | 'obnova'

export default function AdminLoginForm() {
  const [rezim, setRezim] = useState<Rezim>('prihlaseni')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [odeslano, setOdeslano] = useState(false)
  const router = useRouter()

  const prepni = (novy: Rezim) => {
    setRezim(novy)
    setError('')
    setOdeslano(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    })
    if (authError) {
      setError('Nesprávný email nebo heslo.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  const posliObnovu = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    await supabase.auth.resetPasswordForEmail(fd.get('email') as string, {
      redirectTo: `${window.location.origin}/admin/nove-heslo`,
    })

    // Hlásíme úspěch i když e-mail neexistuje — jinak by šlo přes formulář
    // zjišťovat, které adresy mají v systému účet.
    setLoading(false)
    setOdeslano(true)
  }

  if (rezim === 'obnova') {
    return (
      <div className={styles.form}>
        {odeslano ? (
          <>
            <div className="status-msg success">
              Pokud k té adrese existuje účet, poslali jsme na ni odkaz pro nastavení
              nového hesla. Odkaz je jednorázový a po chvíli vyprší.
            </div>
            <button type="button" onClick={() => prepni('prihlaseni')} className={styles.odkaz}>
              ← Zpět na přihlášení
            </button>
          </>
        ) : (
          <form onSubmit={posliObnovu} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="obnova-email">E-mail</label>
              <input
                id="obnova-email"
                className="form-input"
                type="email"
                name="email"
                placeholder="vas@email.cz"
                required
                autoComplete="email"
              />
            </div>
            {error && <div className="status-msg error">{error}</div>}
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Odesílám…' : 'Poslat odkaz'}
            </button>
            <button type="button" onClick={() => prepni('prihlaseni')} className={styles.odkaz}>
              ← Zpět na přihlášení
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="form-group">
        <label className="form-label" htmlFor="email">E-mail</label>
        <input id="email" className="form-input" type="email" name="email" placeholder="vas@email.cz" required autoComplete="email" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="password">Heslo</label>
        <input id="password" className="form-input" type="password" name="password" placeholder="••••••••" required autoComplete="current-password" />
      </div>
      {error && <div className="status-msg error">{error}</div>}
      <button type="submit" className={styles.btn} disabled={loading}>
        {loading ? 'Přihlašuji…' : 'Přihlásit se →'}
      </button>
      <button type="button" onClick={() => prepni('obnova')} className={styles.odkaz}>
        Zapomenuté heslo?
      </button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

export default function Registrace() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMsg('')

    const fd = new FormData(e.currentTarget)
    const jmeno = fd.get('jmeno') as string
    const email = fd.get('email') as string
    const heslo = fd.get('heslo') as string

    // 1. Zaregistruj do Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: heslo,
      options: {
        data: { full_name: jmeno, role: 'host' }
      }
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.push('/profil')
    } else {
      setMsg('Registrace úspěšná. Můžete se nyní přihlásit (nebo potvrdit e-mail, pokud je vyžadováno).')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Vítejte v týmu</h1>
        <p className={styles.subtitle}>
          Vytvořte si profil, získejte roli a připojte se k síti areálu.
        </p>

        {error && <div className="status-msg error" style={{marginBottom: 20}}>{error}</div>}
        {msg && <div className="status-msg success" style={{marginBottom: 20}}>{msg}</div>}

        <form onSubmit={handleRegister} className="form-group" style={{gap: '16px'}}>
          <div>
            <label className="form-label">Celé jméno</label>
            <input name="jmeno" type="text" className="form-input" required placeholder="Jan Novák" />
          </div>
          <div>
            <label className="form-label">E-mail</label>
            <input name="email" type="email" className="form-input" required placeholder="jan@novak.cz" />
          </div>
          <div>
            <label className="form-label">Heslo</label>
            <input name="heslo" type="password" className="form-input" required minLength={6} placeholder="Minimálně 6 znaků" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{marginTop: '10px', justifyContent: 'center'}}>
            {loading ? 'Vytvářím...' : 'Zaregistrovat se'}
          </button>
        </form>

        <div className={styles.loginHint}>
          Už máte účet? <a href="/admin">Přihlaste se</a>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './AdminLoginForm.module.css'

export default function AdminLoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="form-group">
        <label className="form-label">E-mail</label>
        <input className="form-input" type="email" name="email" placeholder="admin@csad.cz" required autoComplete="email" />
      </div>
      <div className="form-group">
        <label className="form-label">Heslo</label>
        <input className="form-input" type="password" name="password" placeholder="••••••••" required autoComplete="current-password" />
      </div>
      {error && <div className="status-msg error">{error}</div>}
      <button type="submit" className={styles.btn} disabled={loading}>
        {loading ? 'Přihlašuji…' : 'Přihlásit se →'}
      </button>
    </form>
  )
}

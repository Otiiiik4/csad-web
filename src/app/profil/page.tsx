'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

export default function Profil() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin') // Redirect to login
      return
    }

    // Fetch profile from table
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      setProfile(data)
    }
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    const fd = new FormData(e.currentTarget)
    await supabase.from('profiles').update({
      full_name: fd.get('full_name'),
      bio: fd.get('bio'),
      avatar_url: fd.get('avatar_url')
    }).eq('id', profile.id)

    setMsg('Profil byl úspěšně aktualizován.')
    setSaving(false)
    loadProfile() // refresh state
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className={styles.loading}>Načítám profil...</div>
  if (!profile) return <div className={styles.loading}>Profil nenalezen.</div>

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        {/* Left side: Avatar & Info */}
        <div className={styles.sidebar}>
          <div className={styles.avatarBox}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          
          <h2 className={styles.name}>{profile.full_name || 'Uživatel bez jména'}</h2>
          <div className={styles.email}>{profile.email}</div>
          
          <div className={styles.roleBadge}>
            Role: <strong>{profile.role.toUpperCase()}</strong>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary" style={{width: '100%', justifyContent: 'center', marginTop: 24}}>
            Odhlásit se
          </button>
        </div>

        {/* Right side: Edit Form */}
        <div className={styles.content}>
          <h1 className={styles.title}>Můj Profil</h1>
          
          {msg && <div className="status-msg success" style={{marginBottom: 24}}>{msg}</div>}

          <form onSubmit={handleSave} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Zobrazované Jméno</label>
              <input type="text" name="full_name" className="form-input" defaultValue={profile.full_name || ''} />
            </div>

            <div className="form-group">
              <label className="form-label">URL Fotky (Avatar)</label>
              <input type="url" name="avatar_url" className="form-input" placeholder="Odkaz na fotku" defaultValue={profile.avatar_url || ''} />
            </div>

            <div className="form-group">
              <label className="form-label">Něco o mně (Bio)</label>
              <textarea name="bio" className="form-textarea" rows={4} placeholder="Napište něco o sobě..." defaultValue={profile.bio || ''} />
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{marginTop: 16}}>
              {saving ? 'Ukládám...' : 'Uložit změny'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

/**
 * Nastavení nového hesla po kliknutí na obnovovací odkaz z e-mailu.
 *
 * Jak to funguje: Supabase v odkazu pošle token v části URL za mřížkou
 * (#access_token=…&type=recovery). Klient v @/lib/supabase má zapnuté
 * detectSessionInUrl, takže si ho sám vyzvedne a založí dočasnou relaci —
 * teprve v ní jde zavolat updateUser s novým heslem.
 *
 * Odkaz je jednorázový. Druhý klik vrátí v URL #error=… a my z toho uděláme
 * srozumitelnou hlášku místo prázdného formuláře.
 */

type Stav = 'overuji' | 'pripraveno' | 'neplatny' | 'hotovo'

const MIN_DELKA = 8

/** Vytáhne parametr z části URL za mřížkou (Supabase je posílá tam, ne v query). */
function zHashe(klic: string): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#/, '')
  return new URLSearchParams(hash).get(klic)
}

export default function NoveHesloForm() {
  const router = useRouter()
  const [stav, setStav] = useState<Stav>('overuji')
  const [chyba, setChyba] = useState('')
  const [uklada, setUklada] = useState(false)

  // Zjištění, jestli máme platnou relaci z obnovovacího odkazu
  useEffect(() => {
    let aktivni = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_udalost, relace) => {
      if (aktivni && relace) setStav('pripraveno')
    })

    // Klient potřebuje chvíli na zpracování tokenu z URL, proto necháme
    // rozhodnutí "neplatný" až na doběhnutí getSession.
    supabase.auth.getSession().then(({ data }) => {
      if (!aktivni) return

      // Prošlý nebo už použitý odkaz → Supabase vrátí chybu rovnou v URL
      const chybaZOdkazu = zHashe('error_description') ?? zHashe('error')
      setStav(chybaZOdkazu || !data.session ? 'neplatny' : 'pripraveno')
    })

    return () => {
      aktivni = false
      subscription.unsubscribe()
    }
  }, [])

  const ulozHeslo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setChyba('')

    const fd = new FormData(e.currentTarget)
    const heslo = fd.get('heslo') as string
    const kontrola = fd.get('heslo_kontrola') as string

    if (heslo !== kontrola) {
      setChyba('Hesla se neshodují.')
      return
    }
    if (heslo.length < MIN_DELKA) {
      setChyba(`Heslo musí mít alespoň ${MIN_DELKA} znaků.`)
      return
    }

    setUklada(true)
    const { error } = await supabase.auth.updateUser({ password: heslo })
    setUklada(false)

    if (error) {
      setChyba(error.message)
      return
    }

    setStav('hotovo')
    setTimeout(() => router.push('/admin/dashboard'), 1800)
  }

  if (stav === 'overuji') {
    return <p className={styles.info}>Ověřuji odkaz…</p>
  }

  if (stav === 'neplatny') {
    return (
      <div>
        <div className="status-msg error" style={{ marginBottom: 20, textAlign: 'left' }}>
          Tenhle odkaz už neplatí. Obnovovací odkaz je jednorázový a po chvíli vyprší —
          nech si prosím poslat nový.
        </div>
        <Link href="/admin" className={styles.odkazZpet}>
          ← Zpět na přihlášení
        </Link>
      </div>
    )
  }

  if (stav === 'hotovo') {
    return (
      <div>
        <div className="status-msg success" style={{ marginBottom: 20, textAlign: 'left' }}>
          Heslo bylo změněno. Přesměrovávám do správy areálu…
        </div>
        <Link href="/admin/dashboard" className={styles.odkazZpet}>
          Pokračovat ručně →
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={ulozHeslo} className={styles.form}>
      <div className="form-group">
        <label className="form-label" htmlFor="heslo">Nové heslo</label>
        <input
          id="heslo"
          className="form-input"
          type="password"
          name="heslo"
          required
          minLength={MIN_DELKA}
          autoComplete="new-password"
          placeholder={`Alespoň ${MIN_DELKA} znaků`}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="heslo_kontrola">Heslo pro kontrolu</label>
        <input
          id="heslo_kontrola"
          className="form-input"
          type="password"
          name="heslo_kontrola"
          required
          minLength={MIN_DELKA}
          autoComplete="new-password"
          placeholder="Zadejte heslo znovu"
        />
      </div>

      {chyba && <div className="status-msg error">{chyba}</div>}

      <button type="submit" className={styles.btn} disabled={uklada}>
        {uklada ? 'Ukládám…' : 'Nastavit heslo'}
      </button>
    </form>
  )
}

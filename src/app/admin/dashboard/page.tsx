'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import styles from './dashboard.module.css'

// ---- Role names for UI ----

const ROLE_NAMES: Record<string, string> = {
  admin:    'Šéfe',
  obsluha:  'Obsluho',
  klub:     'Klubáku',
  tisk:     'Tiskaři',
  autoskola:'Instruktore',
  napojka:  'Barmane',
}

const STATUS_LABELS: Record<string, string> = {
  tisk: 'Digitální tisk', phm: 'Čerpací stanice', parkovani: 'Parkování', klub: 'Klub Proxy',
  autoskoly: 'Autoškoly', vala: 'Dopravní psycholog', verdatex: 'Spedice Verdatex',
  autoservis: 'Autoservis', emise: 'Emise a STK', uhli: 'Prémiová paliva',
  drevo: 'Dřevo Horáček', stas: 'STAS Rýmařov', fve: 'Projekce FVE',
  napoje: 'Nápojové centrum', cetin: 'CETIN', najemci: 'Další nájemci',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState('')
  const [webStatuses, setWebStatuses] = useState<any[]>([])
  const [ceny, setCeny] = useState<any[]>([])
  const [sklad, setSklad] = useState<any[]>([])
  const [garaze, setGaraze] = useState<any[]>([])
  const [nastaveni, setNastaveni] = useState<any>(null)
  const [akce, setAkce] = useState<any[]>([])
  const [zpravy, setZpravy] = useState<any[]>([])
  const [tiskZakazky, setTiskZakazky] = useState<any[]>([])
  const [napoje, setNapoje] = useState<any[]>([])
  const [profily, setProfily] = useState<any[]>([])
  const [saveMsg, setSaveMsg] = useState('')

  const showMsg = (msg: string) => {
    setSaveMsg(msg)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const loadAll = useCallback(async (r: string) => {
    if (['admin', 'obsluha'].includes(r)) {
      const [{ data: c }, { data: s }, { data: g }] = await Promise.all([
        supabase.from('ceny').select('*'),
        supabase.from('sklad').select('*'),
        supabase.from('garaze').select('*'),
      ])
      if (c) setCeny(c)
      if (s) setSklad(s)
      if (g) setGaraze(g)
    }
    if (r === 'admin') {
      const [{ data: ws }, { data: n }, { data: z }, { data: t }, { data: pf }] = await Promise.all([
        supabase.from('web_status').select('*').order('nazev'),
        supabase.from('nastaveni').select('*').single(),
        supabase.from('zpravy').select('*').order('created_at', { ascending: false }),
        supabase.from('poptavky_tisk').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      ])
      if (ws) setWebStatuses(ws)
      if (n) setNastaveni(n)
      if (z) setZpravy(z)
      if (t) setTiskZakazky(t)
      if (pf) setProfily(pf)
    }
    if (['admin', 'klub'].includes(r)) {
      const { data: a } = await supabase.from('akce').select('*').order('id', { ascending: true })
      if (a) setAkce(a)
    }
    if (['admin', 'napojka'].includes(r)) {
      const { data: np } = await supabase.from('napoje').select('*').order('kategorie').order('nazev')
      if (np) setNapoje(np)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/admin'); return }
      setUser(user)
      
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      const r = data?.role || 'user'
      
      setRole(r)
      loadAll(r)
    })
  }, [router, loadAll])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  const toggleStatus = async (kod: string, current: boolean) => {
    await supabase.from('web_status').update({ aktivni: !current }).eq('kod', kod)
    setWebStatuses(prev => prev.map(s => s.kod === kod ? { ...s, aktivni: !current } : s))
  }

  const updateRole = async (id: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setProfily(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p))
    showMsg('✓ Role uživatele změněna')
  }

  const saveCeny = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await Promise.all([
      supabase.from('ceny').update({ hodnota: fd.get('diesel') }).eq('typ', 'diesel'),
      supabase.from('ceny').update({ hodnota: fd.get('natural') }).eq('typ', 'natural'),
      supabase.from('ceny').update({ hodnota: fd.get('adblue') }).eq('typ', 'adblue'),
    ])
    showMsg('✓ Ceny paliv uloženy')
  }

  const saveSklad = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const typy = ['orech2', 'pelety', 'brikety', 'drevo']
    await Promise.all(typy.map(t =>
      supabase.from('sklad').update({ cena: fd.get(`${t}_cena`), stav: fd.get(`${t}_stav`) }).eq('typ', t)
    ))
    showMsg('✓ Sklad uložen')
  }

  const saveGaraze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const typy = ['kamion_noc', 'kamion_vikend', 'auto_mesic', 'garaz_najem']
    await Promise.all(typy.map(t =>
      supabase.from('garaze').update({ cena: fd.get(t) }).eq('typ', t)
    ))
    showMsg('✓ Ceník garáží uložen')
  }

  const saveNastaveni = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await supabase.from('nastaveni').update({
      oznameni_text: fd.get('oznameni_text'),
      oznameni_aktivni: fd.get('oznameni_aktivni') === 'true',
      oteviraci_doba: fd.get('oteviraci_doba'),
      telefon_dispecink: fd.get('telefon_dispecink'),
      email_info: fd.get('email_info'),
    }).eq('id', 1)
    showMsg('✓ Nastavení uloženo')
  }

  const addAkce = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const { data } = await supabase.from('akce').insert([{
      datum: fd.get('datum'), cas: fd.get('cas'), nazev: fd.get('nazev'),
      cena: fd.get('cena'), stav: fd.get('stav') || 'Vstupenky na místě',
    }]).select()
    if (data) setAkce(prev => [...prev, ...data])
    ;(e.target as HTMLFormElement).reset()
    showMsg('✓ Akce přidána')
  }

  const deleteAkce = async (id: number) => {
    if (!confirm('Smazat akci?')) return
    await supabase.from('akce').delete().eq('id', id)
    setAkce(prev => prev.filter(a => a.id !== id))
  }

  const addNapoj = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const { data } = await supabase.from('napoje').insert([{
      nazev: fd.get('nazev'),
      kategorie: fd.get('kategorie'),
      cena: fd.get('cena'),
      akcni_cena: fd.get('akcni_cena') || null,
      stav: fd.get('stav'),
      obrazek_url: fd.get('obrazek_url') || null
    }]).select()
    if (data) setNapoje(prev => [...prev, ...data])
    ;(e.target as HTMLFormElement).reset()
    showMsg('✓ Nápoj přidán')
  }

  const deleteNapoj = async (id: number) => {
    if (!confirm('Opravdu smazat produkt?')) return
    await supabase.from('napoje').delete().eq('id', id)
    setNapoje(prev => prev.filter(n => n.id !== id))
  }

  const updateNapojStav = async (id: number, field: string, value: any) => {
    await supabase.from('napoje').update({ [field]: value }).eq('id', id)
    setNapoje(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n))
  }

  const getVal = (arr: any[], typ: string, field: string) =>
    arr.find(i => i.typ === typ)?.[field] ?? ''

  if (!user) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <span>Ověřuji přihlášení…</span>
    </div>
  )

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.welcome}>
            Vítejte, <span className="text-yellow">{ROLE_NAMES[role] ?? 'Uživateli'}</span> 👋
          </h1>
          <span className={styles.emailBadge}>{user.email}</span>
        </div>
        <div className={styles.headerActions}>
          <a href="/" className={`btn btn-secondary ${styles.homeBtn}`}>🏠 Na web</a>
          <button onClick={handleLogout} className={`btn btn-secondary`}>Odhlásit →</button>
        </div>
      </div>

      {saveMsg && <div className={`status-msg success ${styles.stickyMsg}`}>{saveMsg}</div>}

      <div className={styles.grid}>

        {/* ===== WEB STATUS (admin only) ===== */}
        {role === 'admin' && (
          <div className={`${styles.card} ${styles.fullWidth}`} style={{ borderLeft: '4px solid white' }}>
            <h2 className={styles.cardTitle}>🎛️ Správa obsahu webu (Zamykání karet)</h2>
            <p className={styles.cardSub}>Přepněte služby na aktivní nebo zamčené. Změna se projeví okamžitě.</p>
            <div className={styles.statusGrid}>
              {webStatuses.map(s => (
                <div key={s.kod} className={styles.statusItem}>
                  <div>
                    <strong>{s.nazev}</strong>
                    <span className={s.aktivni ? styles.aktStatus : styles.lockStatus}>
                      {s.aktivni ? '● Aktivní' : '○ Zamčeno'}
                    </span>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={s.aktivni}
                      onChange={() => toggleStatus(s.kod, s.aktivni)}
                    />
                    <span className={styles.toggleSlider} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ZAMĚSTNANCI A PROFILY (admin only) ===== */}
        {role === 'admin' && (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2 className={styles.cardTitle}>👥 Správa Týmu a Uživatelů</h2>
            <div className={styles.akceList}>
              {profily.map(p => (
                <div key={p.id} className={styles.akceRow} style={{ flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', width: '200px' }}>{p.full_name || 'Bez jména'}</span>
                  <span>{p.email}</span>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto' }}>
                    <span className="badge badge-dim">{p.role}</span>
                    <select 
                      className="form-select" 
                      value={p.role}
                      style={{ padding: '0.2rem', width: '130px' }}
                      onChange={(e) => updateRole(p.id, e.target.value)}
                    >
                      <option value="user">Uživatel (Host)</option>
                      <option value="obsluha">Obsluha ČS</option>
                      <option value="klub">Klub Proxy</option>
                      <option value="tisk">Tiskař</option>
                      <option value="autoskola">Autoškola</option>
                      <option value="napojka">Nápojové centrum</option>
                      <option value="admin">Administrátor</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== NASTAVENÍ (admin only) ===== */}
        {role === 'admin' && nastaveni && (
          <div className={`${styles.card} ${styles.fullWidth}`} style={{ border: '1px solid var(--color-yellow)' }}>
            <h2 className={styles.cardTitle}>⚙️ Globální nastavení webu</h2>
            <form onSubmit={saveNastaveni} className={styles.settingsForm}>
              <div className={styles.settingsRow}>
                <div className="form-group" style={{ flex: 3 }}>
                  <label className="form-label">📢 Oznámení v horní liště</label>
                  <input className="form-input" type="text" name="oznameni_text" defaultValue={nastaveni.oznameni_text} placeholder="Např.: Dnes máme slevovou akci…" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Zobrazit?</label>
                  <select className="form-select" name="oznameni_aktivni" defaultValue={nastaveni.oznameni_aktivni ? 'true' : 'false'}>
                    <option value="false">🔴 Vypnuto</option>
                    <option value="true">🟢 Zapnuto</option>
                  </select>
                </div>
              </div>
              <div className={styles.settingsRow}>
                <div className="form-group">
                  <label className="form-label">🕒 Otevírací doba</label>
                  <input className="form-input" type="text" name="oteviraci_doba" defaultValue={nastaveni.oteviraci_doba} />
                </div>
                <div className="form-group">
                  <label className="form-label">📞 Telefon dispečink</label>
                  <input className="form-input" type="text" name="telefon_dispecink" defaultValue={nastaveni.telefon_dispecink} />
                </div>
                <div className="form-group">
                  <label className="form-label">📧 Email info</label>
                  <input className="form-input" type="text" name="email_info" defaultValue={nastaveni.email_info} />
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} style={{ background: 'var(--color-yellow)', color: '#000' }}>💾 Uložit nastavení</button>
            </form>
          </div>
        )}

        {/* ===== CENY PALIV ===== */}
        {['admin', 'obsluha'].includes(role) && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>⛽ Ceny paliv</h2>
            <form onSubmit={saveCeny} className={styles.simpleForm}>
              {[
                { typ: 'diesel', label: 'Nafta (Kč/l)' },
                { typ: 'natural', label: 'Natural 95 (Kč/l)' },
                { typ: 'adblue', label: 'AdBlue (Kč/l)' },
              ].map(f => (
                <div key={f.typ} className={styles.formRow}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" type="number" step="0.01" name={f.typ} defaultValue={getVal(ceny, f.typ, 'hodnota')} />
                </div>
              ))}
              <button type="submit" className={styles.saveBtn}>💾 Uložit ceny</button>
            </form>
          </div>
        )}

        {/* ===== SKLAD ===== */}
        {['admin', 'obsluha'].includes(role) && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🔥 Sklad pevných paliv</h2>
            <form onSubmit={saveSklad} className={styles.simpleForm}>
              {[
                { typ: 'orech2', label: 'Ořech 2 (Kč/t)' },
                { typ: 'pelety', label: 'Pelety (Kč/t)' },
                { typ: 'brikety', label: 'Brikety (Kč/t)' },
                { typ: 'drevo', label: 'Dřevo (Kč/prm)' },
              ].map(f => (
                <div key={f.typ} className={styles.stockRow}>
                  <label className="form-label">{f.label}</label>
                  <div className={styles.stockInputs}>
                    <input className="form-input" type="number" name={`${f.typ}_cena`} defaultValue={getVal(sklad, f.typ, 'cena')} />
                    <select className="form-select" name={`${f.typ}_stav`} defaultValue={getVal(sklad, f.typ, 'stav')}>
                      <option>Skladem</option>
                      <option>Poslední kusy</option>
                      <option>Vyprodáno</option>
                    </select>
                  </div>
                </div>
              ))}
              <button type="submit" className={styles.saveBtn} style={{ background: '#d97706' }}>💾 Uložit sklad</button>
            </form>
          </div>
        )}

        {/* ===== GARÁŽE ===== */}
        {['admin', 'obsluha'].includes(role) && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🚛 Ceník parkování & garáže</h2>
            <form onSubmit={saveGaraze} className={styles.simpleForm}>
              {[
                { typ: 'kamion_noc', label: 'TIR — 1 noc (Kč)' },
                { typ: 'kamion_vikend', label: 'TIR — víkend (Kč)' },
                { typ: 'auto_mesic', label: 'Osobní auto — měsíc (Kč)' },
                { typ: 'garaz_najem', label: 'Pronájem garáže — od (Kč/měsíc)' },
              ].map(f => (
                <div key={f.typ} className={styles.formRow}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" type="number" name={f.typ} defaultValue={getVal(garaze, f.typ, 'cena')} />
                </div>
              ))}
              <button type="submit" className={styles.saveBtn} style={{ background: '#059669' }}>💾 Uložit ceník</button>
            </form>
          </div>
        )}

        {/* ===== NÁPOJOVÉ CENTRUM ===== */}
        {['admin', 'napojka'].includes(role) && (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2 className={styles.cardTitle}>🥤 Správa Nápojového centra</h2>
            <form onSubmit={addNapoj} className={`${styles.settingsRow} ${styles.addAkceForm}`}>
              <input className="form-input" type="text" name="nazev" placeholder="Název zboží" required style={{ flex: 2 }} />
              <select className="form-select" name="kategorie" required>
                <option value="alko">Alkohol</option>
                <option value="nealko">Nealko</option>
                <option value="tabak">Tabák</option>
                <option value="pochutiny">Pochutiny</option>
              </select>
              <input className="form-input" type="number" step="0.01" name="cena" placeholder="Běžná cena (Kč)" required />
              <input className="form-input" type="number" step="0.01" name="akcni_cena" placeholder="Akční cena (Kč)" />
              <input className="form-input" type="url" name="obrazek_url" placeholder="URL obrázku (např. Unsplash)" />
              <select className="form-select" name="stav">
                <option value="Skladem">Skladem</option>
                <option value="Vyprodáno">Vyprodáno</option>
              </select>
              <button type="submit" className={styles.saveBtn} style={{ background: 'var(--color-blue)', color: '#fff' }}>Přidat produkt</button>
            </form>
            
            <div className={styles.akceList}>
              {napoje.length === 0 && <p className={styles.empty}>Žádné produkty v nabídce.</p>}
              {napoje.map(n => (
                <div key={n.id} className={styles.akceRow} style={{ flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', width: '200px' }}>{n.nazev}</span>
                  <span className="badge badge-dim">{n.kategorie}</span>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      className="form-input" 
                      defaultValue={n.cena}
                      style={{ width: '90px', padding: '0.2rem' }}
                      onBlur={(e) => updateNapojStav(n.id, 'cena', e.target.value)}
                      title="Běžná cena"
                    /> Kč
                    
                    <input 
                      type="number" 
                      className="form-input" 
                      defaultValue={n.akcni_cena || ''}
                      style={{ width: '90px', padding: '0.2rem', borderColor: 'var(--color-yellow)' }}
                      onBlur={(e) => updateNapojStav(n.id, 'akcni_cena', e.target.value || null)}
                      placeholder="Bez akce"
                      title="Akční cena"
                    /> Kč
                    
                    <select 
                      className="form-select" 
                      defaultValue={n.stav}
                      style={{ padding: '0.2rem', width: '110px' }}
                      onChange={(e) => updateNapojStav(n.id, 'stav', e.target.value)}
                    >
                      <option value="Skladem">Skladem</option>
                      <option value="Vyprodáno">Vyprodáno</option>
                    </select>
                    
                    <input 
                      type="url" 
                      className="form-input" 
                      defaultValue={n.obrazek_url || ''}
                      style={{ width: '150px', padding: '0.2rem' }}
                      onBlur={(e) => updateNapojStav(n.id, 'obrazek_url', e.target.value || null)}
                      placeholder="URL Obrázku"
                      title="URL obrázku"
                    />
                  </div>
                  
                  <button className={styles.deleteBtn} onClick={() => deleteNapoj(n.id)}>Smazat</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PROGRAM KLUBU ===== */}
        {['admin', 'klub'].includes(role) && (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2 className={styles.cardTitle}>🎸 Program klubu Proxy</h2>
            <form onSubmit={addAkce} className={`${styles.settingsRow} ${styles.addAkceForm}`}>
              <input className="form-input" type="text" name="datum" placeholder="Datum (např. 15.6.)" required />
              <input className="form-input" type="text" name="cas" placeholder="Čas (např. 20:00)" required />
              <input className="form-input" type="text" name="nazev" placeholder="Název kapely / akce" required style={{ flex: 2 }} />
              <input className="form-input" type="number" name="cena" placeholder="Vstupné (0 = zdarma)" required />
              <input className="form-input" type="text" name="stav" placeholder="Stav" defaultValue="Vstupenky na místě" />
              <button type="submit" className={styles.saveBtn} style={{ background: 'var(--color-pink)', color: '#fff' }}>Přidat</button>
            </form>
            <div className={styles.akceList}>
              {akce.length === 0 && <p className={styles.empty}>Žádné akce v programu.</p>}
              {akce.map(a => (
                <div key={a.id} className={styles.akceRow}>
                  <span className={styles.akceDate}>{a.datum}</span>
                  <span className={styles.akceNazev}>{a.nazev}</span>
                  <span className={styles.akceCena}>{a.cena === 0 ? 'Zdarma' : `${a.cena} Kč`}</span>
                  <button className={styles.deleteBtn} onClick={() => deleteAkce(a.id)}>Smazat</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TISKOVÉ POPTÁVKY (admin + tisk) ===== */}
        {['admin', 'tisk'].includes(role) && (
          <div className={`${styles.card} ${styles.fullWidth}`} style={{ borderLeft: '4px solid var(--color-blue)' }}>
            <h2 className={styles.cardTitle}>🖨️ Tiskové zakázky — příchozí poptávky</h2>
            <div className={styles.zpravyList}>
              {tiskZakazky.length === 0 && <p className={styles.empty}>Žádné nové poptávky.</p>}
              {tiskZakazky.map(z => (
                <div key={z.id} className={styles.zpravaCard}>
                  <div className={styles.zpravaHeader}>
                    <strong>{z.jmeno}</strong>
                    <span>{z.email}</span>
                    <span>{z.telefon}</span>
                    <span className="badge badge-blue">{z.typ_zakazky}</span>
                    <span className={styles.zpravaDate}>{new Date(z.created_at).toLocaleDateString('cs-CZ')}</span>
                  </div>
                  <p className={styles.zpravaText}>{z.popis}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ZPRÁVY (admin + obsluha) ===== */}
        {['admin', 'obsluha'].includes(role) && (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2 className={styles.cardTitle}>📩 Příchozí zprávy (kontaktní formulář)</h2>
            <div className={styles.zpravyList}>
              {zpravy.length === 0 && <p className={styles.empty}>Žádné nové zprávy.</p>}
              {zpravy.map(z => (
                <div key={z.id} className={`${styles.zpravaCard} ${z.precteno ? styles.precteno : ''}`}>
                  <div className={styles.zpravaHeader}>
                    <strong>{z.jmeno}</strong>
                    <span>{z.email}</span>
                    {!z.precteno && <span className="badge badge-yellow">Nová</span>}
                    <span className={styles.zpravaDate}>{new Date(z.created_at).toLocaleDateString('cs-CZ')}</span>
                  </div>
                  <p className={styles.zpravaText}>{z.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

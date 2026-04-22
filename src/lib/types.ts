// Database type definitions for CSAD Rýmařov

export interface WebStatus {
  id: number
  kod: string
  nazev: string
  aktivni: boolean
}

export interface Nastaveni {
  id: number
  oznameni_text: string
  oznameni_aktivni: boolean
  oteviraci_doba: string
  telefon_dispecink: string
  email_info: string
}

export interface Cena {
  id: number
  typ: string
  hodnota: number
  updated_at: string
}

export interface SkladItem {
  id: number
  typ: string
  nazev: string
  cena: number
  stav: 'Skladem' | 'Poslední kusy' | 'Vyprodáno'
  updated_at: string
}

export interface Garaz {
  id: number
  typ: string
  nazev: string
  cena: number
}

export interface Akce {
  id: number
  datum: string
  cas: string
  nazev: string
  cena: number
  stav: string
  created_at: string
}

export interface PoptavkaTisk {
  id: number
  jmeno: string
  email: string
  telefon: string | null
  typ_zakazky: string | null
  popis: string | null
  stav: string
  created_at: string
}

export interface Zprava {
  id: number
  jmeno: string
  email: string
  text: string
  precteno: boolean
  created_at: string
}

export interface Napoj {
  id: number
  nazev: string
  kategorie: string
  cena: number
  akcni_cena: number | null
  stav: string
  obrazek_url: string | null
  created_at: string
}

export interface AutoskolaNovinka {
  id: number
  text: string
  skola: string
  created_at: string
}

export interface AutoskolaSoubor {
  id: number
  nazev: string
  skola: string
  url: string
  created_at: string
}

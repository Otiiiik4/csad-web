'use server'

import { createServerClient } from '@/lib/supabase'

export async function askNavi(question: string): Promise<string> {
  const q = question.toLowerCase()
  const sb = createServerClient()

  // 1. Ceny paliv
  if (q.includes('naft') || q.includes('benz') || q.includes('adblue') || q.includes('cena') || q.includes('paliv')) {
    const { data } = await sb.from('ceny').select('*')
    if (!data) return 'Omlouvám se, ale momentálně nemám přístup k ceníku paliv.'
    
    const nafta = data.find(d => d.typ === 'diesel')?.hodnota || '?'
    const benzin = data.find(d => d.typ === 'natural')?.hodnota || '?'
    const adblue = data.find(d => d.typ === 'adblue')?.hodnota || '?'
    
    return `Aktuální ceny na naší NONSTOP čerpací stanici jsou:\n• **Nafta (Diesel)**: ${nafta} Kč/l\n• **Natural 95**: ${benzin} Kč/l\n• **AdBlue**: ${adblue} Kč/l\n\nStanice je otevřena 24 hodin denně, 7 dní v týdnu. Přijímáme karty i hotovost.`
  }

  // 2. Parkování a garáže
  if (q.includes('parkov') || q.includes('kamion') || q.includes('tir') || q.includes('garaz') || q.includes('stani')) {
    const { data } = await sb.from('garaze').select('*')
    const noc = data?.find(d => d.typ === 'kamion_noc')?.cena || 250
    const vikend = data?.find(d => d.typ === 'kamion_vikend')?.cena || 500
    return `Nabízíme bezpečné hlídané parkování pro TIR i osobní vozy.\n• **TIR přes noc** (vč. sprchy a WC): ${noc} Kč\n• **TIR Víkend**: ${vikend} Kč\n\nMáme také k pronájmu XXL garáže s montážní jámou. Areál je hlídán kamerovým systémem.`
  }

  // 3. Klub a akce
  if (q.includes('klub') || q.includes('akce') || q.includes('proxy') || q.includes('hudb') || q.includes('party') || q.includes('párty')) {
    const { data: status } = await sb.from('web_status').select('aktivni').eq('kod', 'klub').single()
    if (status?.aktivni === false) return 'Klub Proxy je momentálně bohužel uzavřen z rozhodnutí administrátora.'
    
    const { data: akce } = await sb.from('akce').select('*').limit(3).order('id', { ascending: true })
    if (akce && akce.length > 0) {
      const akceStr = akce.map(a => `• **${a.nazev}** (${a.datum} od ${a.cas}) - ${a.cena === 0 ? 'ZDARMA' : a.cena + ' Kč'}`).join('\n')
      return `Klub Proxy je v provozu a bar je plně zásoben! 🎸 Nejbližší akce:\n${akceStr}\n\nTěšíme se na vás na parketu.`
    }
    return `Klub Proxy je připraven na pořádnou párty, ale zrovna teď nemáme v databázi vypsané žádné nadcházející akce. Sledujte náš web proxyrymarov.cz pro novinky!`
  }

  // 4. Tisk a grafika
  if (q.includes('tisk') || q.includes('vizitk') || q.includes('letak') || q.includes('kopir') || q.includes('grafik') || q.includes('placht')) {
    const { data: status } = await sb.from('web_status').select('aktivni').eq('kod', 'tisk').single()
    if (status?.aktivni === false) return 'Naše tiskové centrum je momentálně mimo provoz. Zkuste to prosím později.'
    return `Naše tiskové centrum je vám plně k dispozici! 🖨️\nTiskneme vše od vizitek po obří reklamní plachty na budovy. Zastavte se u nás od pondělí do pátku (8:00 - 16:00), nebo nám rovnou pošlete poptávku přes formulář v sekci Digitální tisk.`
  }

  // 5. Otevírací doba / Kontakt / Kde jste
  if (q.includes('kde') || q.includes('otevir') || q.includes('kontakt') || q.includes('kdy') || q.includes('adresa') || q.includes('telefon')) {
    return `Jsme obrovský logistický areál CSAD v srdci Rýmařova. 📍\n\n**Adresa:** Žižkova 260/21, Rýmařov\n**Telefon:** +420 601 223 344\n\nČerpací stanice a parkování TIR fungují **NONSTOP** (24/7). Tiskové centrum a administrativa Po-Pá 8-16h.`
  }

  // 6. Nápoje, jídlo
  if (q.includes('napoj') || q.includes('piti') || q.includes('alkohol') || q.includes('jist') || q.includes('jidl') || q.includes('tabak') || q.includes('cigaret')) {
    const { data: status } = await sb.from('web_status').select('aktivni').eq('kod', 'napoje').single()
    if (status?.aktivni === false) return 'Nápojové centrum je momentálně nedostupné.'
    return `V areálu máme velkoobchodní i maloobchodní Nápojové centrum. 🥤 Nabízíme alkohol, nealko, tabák a drobné pochutiny. Zastavte se u nás doplnit zásoby před další cestou!`
  }

  // 7. Pozdravy a běžná konverzace
  if (q.includes('ahoj') || q.includes('dobrý den') || q.includes('cau') || q.includes('čau') || q.includes('zdar')) {
    return `Dobrý den! Já jsem **Navi** 🤖, digitální asistent a virtuální dispečer areálu CSAD. Jsem napojený přímo na srdce našeho systému. Můžete se mě zeptat na aktuální ceny nafty, parkování, tisk, nebo program v klubu.`
  }

  // 8. Kdo jsi?
  if (q.includes('kdo jsi') || q.includes('co jsi') || q.includes('navi')) {
    return `Jsem **Navi**, exkluzivní virtuální asistent vyvinutý speciálně pro logistický areál CSAD Rýmařov. Mým úkolem je šetřit čas našemu personálu a okamžitě vám poskytnout přesná data z naší databáze. 😎`
  }

  // Default fallback
  return `Tomuto úplně nerozumím. 😅\nJsem Navi 🤖, digitální dispečer areálu CSAD. Zeptejte se mě raději na:\n• Ceny paliv\n• Parkování TIR\n• Digitální tisk\n• Hudební klub Proxy\n• Otevírací dobu nebo kontakt.`
}

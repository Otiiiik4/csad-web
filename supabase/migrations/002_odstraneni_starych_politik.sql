-- =============================================================================
-- CSAD RÝMAŘOV — Odstranění starých, příliš povolných RLS politik
-- =============================================================================
--
-- PROČ TOHLE MUSÍ PROBĚHNOUT:
-- Migrace 001 přidala politiky podle rolí, ale staré politiky z původního
-- nastavení zůstaly vedle nich. Postgres politiky SČÍTÁ (vyhodnocuje je přes
-- OR), takže vždy vyhraje ta nejpovolnější. Po migraci 001 tedy platilo:
--
--   "Admin Full Access"  → cmd ALL, role authenticated, podmínka: true
--
-- To znamená, že KDOKOLI PŘIHLÁŠENÝ měl plný zápis do všech tabulek. A protože
-- registrace na /registrace je otevřená komukoli, stačilo se zaregistrovat a
-- šlo přepsat ceny paliv, smazat program klubu nebo si přečíst všechny
-- poptávky a zprávy zákazníků (jména, e-maily, telefony).
--
--   "Public profiles are viewable by everyone." → SELECT, podmínka: true
--
-- Tahle nechávala i nepřihlášeného návštěvníka přečíst všechny profily
-- včetně e-mailových adres.
--
-- Dokud tyhle politiky existují, je celá migrace 001 bez efektu.
--
-- JAK SPUSTIT:
--   Supabase → SQL Editor → New query → vlož tenhle soubor → Run
--   Skript je idempotentní, jde ho pustit opakovaně.
--
-- BEZPEČNÉ ODSTRANIT? Ano. Ověřeno, že politiky z migrace 001 pokrývají
-- všechno, co dashboard i veřejný web potřebují, a že účty otagardener@gmail.com
-- a admin@csad.cz mají v public.profiles roli 'admin'. O přístup tedy nepřijdeš.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Plný přístup pro kohokoli přihlášeného — hlavní díra
-- -----------------------------------------------------------------------------
drop policy if exists "Admin Full Access" on public.web_status;
drop policy if exists "Admin Full Access" on public.ceny;
drop policy if exists "Admin Full Access" on public.sklad;
drop policy if exists "Admin Full Access" on public.garaze;
drop policy if exists "Admin Full Access" on public.akce;
drop policy if exists "Admin Full Access" on public.nastaveni;
drop policy if exists "Admin Full Access" on public.napoje;
drop policy if exists "Admin Full Access" on public.poptavky_tisk;
drop policy if exists "Admin Full Access" on public.zpravy;


-- -----------------------------------------------------------------------------
-- 2. Duplicitní veřejné čtení (nahrazeno politikami *_read z migrace 001)
-- -----------------------------------------------------------------------------
drop policy if exists "Public Read" on public.web_status;
drop policy if exists "Public Read" on public.ceny;
drop policy if exists "Public Read" on public.sklad;
drop policy if exists "Public Read" on public.garaze;
drop policy if exists "Public Read" on public.akce;
drop policy if exists "Public Read" on public.nastaveni;
drop policy if exists "Public Read" on public.napoje;


-- -----------------------------------------------------------------------------
-- 3. Duplicitní vkládání z formulářů (nahrazeno politikami *_insert)
-- -----------------------------------------------------------------------------
drop policy if exists "Public Insert" on public.poptavky_tisk;
drop policy if exists "Public Insert" on public.zpravy;


-- -----------------------------------------------------------------------------
-- 4. Profily — staré politiky obcházely i trigger chránící sloupec role
-- -----------------------------------------------------------------------------
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can update own profile."             on public.profiles;
drop policy if exists "Users can insert their own profile."       on public.profiles;
drop policy if exists "Admins can update any profile."            on public.profiles;


-- -----------------------------------------------------------------------------
-- 5. Trigger funkce nemají být volatelné přes veřejné REST API
-- -----------------------------------------------------------------------------
-- handle_new_user() a protect_profile_role() jsou SECURITY DEFINER trigger
-- funkce z migrace 001. Supabase je ale vystavil i jako /rest/v1/rpc/…, takže
-- je mohl zavolat kdokoli. Jako triggery fungují dál — ty se spouští pod
-- vlastníkem tabulky, ne pod volajícím.
revoke all on function public.handle_new_user()      from public, anon, authenticated;
revoke all on function public.protect_profile_role() from public, anon, authenticated;

-- Zbytek po původním nastavení: is_admin() už žádná politika nepoužívá
-- (používala ji jen smazaná "Admins can update any profile."). Nemá nastavený
-- search_path, což je u SECURITY DEFINER funkce riziko — doplníme ho a
-- zavřeme volání zvenčí. Nemažeme ji, aby migrace nespadla, kdyby na ni ještě
-- něco viselo.
do $$
begin
  if exists (select 1 from pg_proc where proname = 'is_admin') then
    execute 'alter function public.is_admin() set search_path = public';
    execute 'revoke all on function public.is_admin() from public, anon, authenticated';
  end if;
end $$;


-- =============================================================================
-- KONTROLA — po spuštění musí zůstat jen politiky v malých písmenech
-- (web_status_read, ceny_write, profiles_read_own, …). Žádná se nesmí
-- jmenovat "Admin Full Access", "Public Read", "Public Insert" ani začínat
-- velkým písmenem.
-- =============================================================================
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- =============================================================================
-- JEŠTĚ JEDNO NASTAVENÍ MIMO SQL
-- =============================================================================
-- Supabase → Authentication → Policies → Password security:
-- zapnout "Leaked password protection" (kontrola hesel proti HaveIBeenPwned).
-- Teď je vypnutá, takže projde i heslo z veřejných úniků.
-- =============================================================================

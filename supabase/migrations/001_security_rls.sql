-- =============================================================================
-- CSAD RÝMAŘOV — Zabezpečení databáze (Row Level Security)
-- =============================================================================
--
-- PROČ: Web posílá do prohlížeče veřejný "anon" klíč. Dokud je RLS vypnuté,
-- může si kdokoli otevřít konzoli prohlížeče a přepsat ceny paliv, smazat
-- akce klubu nebo si nastavit roli administrátora. Tato migrace to zavírá.
--
-- JAK SPUSTIT:
--   1. Supabase → SQL Editor → New query
--   2. Vlož celý tento soubor a spusť (Run)
--   3. Skript je idempotentní — jde ho pustit opakovaně bez škody
--
-- MODEL OPRÁVNĚNÍ:
--   veřejnost (nepřihlášený)  → čte ceníky a program, může odeslat formulář
--   obsluha                   → ceny paliv, sklad, garáže, příchozí zprávy
--   klub                      → program akcí
--   napojka                   → nápojové centrum
--   tisk                      → tiskové poptávky
--   admin                     → vše + zamykání služeb + role uživatelů
--
-- POZOR: Než spustíš, ujisti se, že máš alespoň jeden účet s rolí 'admin'
-- (viz sekce 9 na konci souboru).
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Tabulka profilů
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  avatar_url text,
  bio        text,
  role       text not null default 'user',
  created_at timestamptz not null default now()
);

-- Doplnění sloupců, pokud tabulka už existovala v jiné podobě
alter table public.profiles add column if not exists email      text;
alter table public.profiles add column if not exists full_name  text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio        text;
alter table public.profiles add column if not exists role       text not null default 'user';
alter table public.profiles add column if not exists created_at timestamptz not null default now();

-- Srovnání starých rolí. Dřívější verze /registrace zapisovala roli 'host',
-- na které by se přidání constraintu níže zaseklo.
update public.profiles
set role = 'user'
where role is null
   or role not in ('user', 'obsluha', 'klub', 'tisk', 'autoskola', 'napojka', 'admin');

-- Povolené role — brání překlepům i podstrčení vymyšlené role
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add  constraint profiles_role_check
  check (role in ('user', 'obsluha', 'klub', 'tisk', 'autoskola', 'napojka', 'admin'));


-- -----------------------------------------------------------------------------
-- 2. Automatické založení profilu po registraci
-- -----------------------------------------------------------------------------
-- Role se NIKDY nebere z metadat registrace (ta si útočník může nastavit sám),
-- vždy se použije bezpečné výchozí 'user'. Roli povyšuje pouze admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Doplnění profilů pro už existující uživatele
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, nullif(u.raw_user_meta_data ->> 'full_name', ''), 'user'
from auth.users u
on conflict (id) do nothing;


-- -----------------------------------------------------------------------------
-- 3. Pomocná funkce: role přihlášeného uživatele
-- -----------------------------------------------------------------------------
-- SECURITY DEFINER obchází RLS, jinak by politiky nad profiles zacyklily.
create or replace function public.auth_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.role from public.profiles p where p.id = auth.uid()), 'anon');
$$;

revoke all on function public.auth_role() from public;
grant execute on function public.auth_role() to anon, authenticated;


-- -----------------------------------------------------------------------------
-- 4. Ochrana proti povýšení vlastní role
-- -----------------------------------------------------------------------------
-- RLS neumí omezit jednotlivé sloupce, proto trigger: pokud si roli mění někdo
-- jiný než admin, změna se tiše zahodí a zůstane původní hodnota.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Zásahy ze SQL Editoru / service_role (bez JWT) necháváme projít
  if current_setting('request.jwt.claims', true) is null then
    return new;
  end if;

  if new.role is distinct from old.role and public.auth_role() <> 'admin' then
    new.role := old.role;
  end if;

  new.id         := old.id;          -- id se nemění nikdy
  new.created_at := old.created_at;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_trg on public.profiles;
create trigger protect_profile_role_trg
  before update on public.profiles
  for each row execute function public.protect_profile_role();


-- -----------------------------------------------------------------------------
-- 5. Zapnutí RLS na všech tabulkách
-- -----------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.web_status    enable row level security;
alter table public.ceny          enable row level security;
alter table public.sklad         enable row level security;
alter table public.garaze        enable row level security;
alter table public.akce          enable row level security;
alter table public.nastaveni     enable row level security;
alter table public.napoje        enable row level security;
alter table public.poptavky_tisk enable row level security;
alter table public.zpravy        enable row level security;


-- -----------------------------------------------------------------------------
-- 6. Veřejně čitelné číselníky, zápis jen pro danou roli
-- -----------------------------------------------------------------------------
-- Pomocný makro-vzor: čtení pro všechny, zápis pro vyjmenované role.

-- web_status — zamykání služeb (jen admin)
drop policy if exists "web_status_read"  on public.web_status;
drop policy if exists "web_status_write" on public.web_status;
create policy "web_status_read"  on public.web_status for select using (true);
create policy "web_status_write" on public.web_status for all
  using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- ceny paliv — admin + obsluha
drop policy if exists "ceny_read"  on public.ceny;
drop policy if exists "ceny_write" on public.ceny;
create policy "ceny_read"  on public.ceny for select using (true);
create policy "ceny_write" on public.ceny for all
  using (public.auth_role() in ('admin', 'obsluha'))
  with check (public.auth_role() in ('admin', 'obsluha'));

-- sklad pevných paliv — admin + obsluha
drop policy if exists "sklad_read"  on public.sklad;
drop policy if exists "sklad_write" on public.sklad;
create policy "sklad_read"  on public.sklad for select using (true);
create policy "sklad_write" on public.sklad for all
  using (public.auth_role() in ('admin', 'obsluha'))
  with check (public.auth_role() in ('admin', 'obsluha'));

-- ceník garáží — admin + obsluha
drop policy if exists "garaze_read"  on public.garaze;
drop policy if exists "garaze_write" on public.garaze;
create policy "garaze_read"  on public.garaze for select using (true);
create policy "garaze_write" on public.garaze for all
  using (public.auth_role() in ('admin', 'obsluha'))
  with check (public.auth_role() in ('admin', 'obsluha'));

-- program klubu — admin + klub
drop policy if exists "akce_read"  on public.akce;
drop policy if exists "akce_write" on public.akce;
create policy "akce_read"  on public.akce for select using (true);
create policy "akce_write" on public.akce for all
  using (public.auth_role() in ('admin', 'klub'))
  with check (public.auth_role() in ('admin', 'klub'));

-- nápojové centrum — admin + napojka
drop policy if exists "napoje_read"  on public.napoje;
drop policy if exists "napoje_write" on public.napoje;
create policy "napoje_read"  on public.napoje for select using (true);
create policy "napoje_write" on public.napoje for all
  using (public.auth_role() in ('admin', 'napojka'))
  with check (public.auth_role() in ('admin', 'napojka'));

-- globální nastavení (oznámení, kontakty) — jen admin
drop policy if exists "nastaveni_read"  on public.nastaveni;
drop policy if exists "nastaveni_write" on public.nastaveni;
create policy "nastaveni_read"  on public.nastaveni for select using (true);
create policy "nastaveni_write" on public.nastaveni for all
  using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');


-- -----------------------------------------------------------------------------
-- 7. Formuláře — kdokoli smí odeslat, číst smí jen personál
-- -----------------------------------------------------------------------------
-- Klíčové: veřejnost NESMÍ číst příchozí poptávky a zprávy (jsou v nich
-- e-maily a telefony zákazníků = osobní údaje).

drop policy if exists "poptavky_insert" on public.poptavky_tisk;
drop policy if exists "poptavky_read"   on public.poptavky_tisk;
drop policy if exists "poptavky_manage" on public.poptavky_tisk;
create policy "poptavky_insert" on public.poptavky_tisk for insert with check (true);
create policy "poptavky_read"   on public.poptavky_tisk for select
  using (public.auth_role() in ('admin', 'tisk'));
create policy "poptavky_manage" on public.poptavky_tisk for update
  using (public.auth_role() in ('admin', 'tisk'))
  with check (public.auth_role() in ('admin', 'tisk'));

drop policy if exists "zpravy_insert" on public.zpravy;
drop policy if exists "zpravy_read"   on public.zpravy;
drop policy if exists "zpravy_manage" on public.zpravy;
create policy "zpravy_insert" on public.zpravy for insert with check (true);
create policy "zpravy_read"   on public.zpravy for select
  using (public.auth_role() in ('admin', 'obsluha'));
create policy "zpravy_manage" on public.zpravy for update
  using (public.auth_role() in ('admin', 'obsluha'))
  with check (public.auth_role() in ('admin', 'obsluha'));


-- -----------------------------------------------------------------------------
-- 8. Profily — vidím sebe, admin vidí všechny
-- -----------------------------------------------------------------------------
drop policy if exists "profiles_read_own"    on public.profiles;
drop policy if exists "profiles_update_own"  on public.profiles;
drop policy if exists "profiles_insert_own"  on public.profiles;
drop policy if exists "profiles_admin_all"   on public.profiles;

create policy "profiles_read_own" on public.profiles for select
  using (id = auth.uid() or public.auth_role() = 'admin');

create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid() or public.auth_role() = 'admin')
  with check (id = auth.uid() or public.auth_role() = 'admin');
  -- (změnu sloupce role hlídá trigger protect_profile_role_trg)

create policy "profiles_insert_own" on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_admin_all" on public.profiles for delete
  using (public.auth_role() = 'admin');


-- -----------------------------------------------------------------------------
-- 9. Realtime — tabulky, u kterých se má web sám překreslovat
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['web_status','ceny','napoje','sklad','garaze','akce','nastaveni']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;


-- =============================================================================
-- POSLEDNÍ KROK — nastavení administrátora
-- =============================================================================
-- Účet musí v Supabase existovat DŘÍV, než tenhle příkaz proběhne. Pokud ještě
-- neexistuje, příkaz nic neudělá (nespadne) — po založení účtu ho pusť znovu
-- samostatně, celou migraci kvůli tomu opakovat nemusíš.

update public.profiles
set role      = 'admin',
    full_name = coalesce(nullif(full_name, ''), 'Admin123')
where email = 'otagardener@gmail.com';

-- Kontrola: musí vrátit řádek s rolí admin
select email, full_name, role
from public.profiles
order by role, email;
-- =============================================================================

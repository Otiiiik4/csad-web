-- =============================================================================
-- CSAD RÝMAŘOV — Přepínač režimu údržby
-- =============================================================================
--
-- Údržba se dřív zapínala proměnnou prostředí MAINTENANCE_MODE na Vercelu,
-- což znamenalo lézt do nastavení hostingu a čekat na redeploy. Nově je to
-- tlačítko v /admin/dashboard a stav se drží tady v databázi.
--
-- Čte to src/proxy.ts (anonymním klíčem přes REST, s ~15s cache), zapisuje
-- dashboard pod přihlášeným adminem. Politika nastaveni_write z migrace 001
-- zajišťuje, že přepnout to může jen role admin.
--
-- MAINTENANCE_MODE zůstává jako nouzová brzda s přednostní platností —
-- hodí se, když je Supabase nedostupný.
--
-- STAV: spuštěno 2026-09-08 přes Supabase MCP.
-- =============================================================================

-- Výchozí true, protože web byl v době přidání sloupce v údržbě.
-- Po nasazení se tedy nic samo nezveřejní.
alter table public.nastaveni
  add column if not exists udrzba_aktivni boolean not null default true;

update public.nastaveni set udrzba_aktivni = true where udrzba_aktivni is null;

-- Kontrola
select id, udrzba_aktivni from public.nastaveni;

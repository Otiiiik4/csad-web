-- 1. Tabulka pro Otevírání/Zavírání karet služeb na webu
CREATE TABLE IF NOT EXISTS public.web_status (
    id SERIAL PRIMARY KEY,
    kod TEXT UNIQUE NOT NULL,
    nazev TEXT NOT NULL,
    aktivni BOOLEAN DEFAULT true
);

INSERT INTO public.web_status (kod, nazev, aktivni) VALUES
('tisk', 'Digitální tisk', true),
('cerpaci_stanice', 'Čerpací stanice', true),
('parkovani_garaze', 'Parkování TIR a Garáže', true),
('hudebni_klub', 'Klub Proxy', true),
('prodej_paliv', 'Sklad uhlí a paliv', true),
('drevo', 'Dřevo Horáček', true),
('autoskoly', 'Autoškoly', true),
('spedice', 'Spedice Verdatex', true),
('autoservis', 'Autoservis', false),
('napoje', 'Nápojové centrum', true),
('mycka', 'Myčka TIR', false)
ON CONFLICT (kod) DO NOTHING;

-- 2. Tabulka pro Ceny paliv
CREATE TABLE IF NOT EXISTS public.ceny (
    id SERIAL PRIMARY KEY,
    typ TEXT UNIQUE NOT NULL,
    hodnota NUMERIC(10,2) NOT NULL
);

INSERT INTO public.ceny (typ, hodnota) VALUES
('diesel', 38.90),
('natural', 37.50),
('adblue', 12.00)
ON CONFLICT (typ) DO NOTHING;

-- 3. Tabulka pro Sklad paliv a uhlí
CREATE TABLE IF NOT EXISTS public.sklad (
    id SERIAL PRIMARY KEY,
    typ TEXT UNIQUE NOT NULL,
    cena NUMERIC(10,2) NOT NULL,
    stav TEXT NOT NULL
);

INSERT INTO public.sklad (typ, cena, stav) VALUES
('orech2', 590.00, 'Skladem'),
('pelety', 850.00, 'Poslední kusy'),
('brikety', 720.00, 'Skladem'),
('drevo', 1200.00, 'Skladem')
ON CONFLICT (typ) DO NOTHING;

-- 4. Tabulka pro Garáže a parkování
CREATE TABLE IF NOT EXISTS public.garaze (
    id SERIAL PRIMARY KEY,
    typ TEXT UNIQUE NOT NULL,
    cena NUMERIC(10,2) NOT NULL
);

INSERT INTO public.garaze (typ, cena) VALUES
('kamion_noc', 350.00),
('kamion_vikend', 800.00),
('auto_mesic', 1500.00),
('garaz_najem', 2500.00)
ON CONFLICT (typ) DO NOTHING;

-- 5. Tabulka pro Akce klubu
CREATE TABLE IF NOT EXISTS public.akce (
    id SERIAL PRIMARY KEY,
    datum TEXT NOT NULL,
    cas TEXT NOT NULL,
    nazev TEXT NOT NULL,
    cena NUMERIC(10,2) NOT NULL,
    stav TEXT NOT NULL
);

INSERT INTO public.akce (datum, cas, nazev, cena, stav) VALUES
('14.6.2025', 'Od 20:00', 'Midnight Echo — Rock Night', 200, 'Vstupenky na místě'),
('28.6.2025', 'Od 21:00', 'DJ Karlos — Letní párty', 150, 'Vstupenky online'),
('12.7.2025', 'Od 19:30', 'Bronx Rangers — Country & Rock', 250, 'Posledních 30 vstupenek');

-- 6. Globální nastavení
CREATE TABLE IF NOT EXISTS public.nastaveni (
    id SERIAL PRIMARY KEY,
    oznameni_text TEXT,
    oznameni_aktivni BOOLEAN DEFAULT false,
    oteviraci_doba TEXT,
    telefon_dispecink TEXT,
    email_info TEXT
);

INSERT INTO public.nastaveni (oznameni_text, oznameni_aktivni, oteviraci_doba, telefon_dispecink, email_info) VALUES
('Dnes zavřeno z důvodu svátku', false, 'Po-Ne: 05:00 - 22:00', '+420 123 456 789', 'info@csadrymarov.cz');

-- 7. Poptávky z formulářů (Tisk)
CREATE TABLE IF NOT EXISTS public.poptavky_tisk (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    jmeno TEXT NOT NULL,
    email TEXT NOT NULL,
    telefon TEXT,
    sluzba TEXT,
    zprava TEXT,
    vyreseno BOOLEAN DEFAULT false
);

-- 8. Zprávy (Kontakt)
CREATE TABLE IF NOT EXISTS public.zpravy (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    jmeno TEXT NOT NULL,
    email TEXT NOT NULL,
    predmet TEXT,
    zprava TEXT,
    precteno BOOLEAN DEFAULT false
);

-- 9. Nápoje
CREATE TABLE IF NOT EXISTS public.napoje (
    id SERIAL PRIMARY KEY,
    nazev TEXT NOT NULL,
    kategorie TEXT NOT NULL,
    cena NUMERIC(10,2) NOT NULL,
    akcni_cena NUMERIC(10,2),
    stav TEXT DEFAULT 'Skladem'
);

-- Turn off Row Level Security (RLS) temporary for public access so that Next.js doesn't get blocked
ALTER TABLE public.web_status DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceny DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sklad DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.garaze DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.akce DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.nastaveni DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.poptavky_tisk DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.zpravy DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.napoje DISABLE ROW LEVEL SECURITY;

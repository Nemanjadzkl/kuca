-- Kreiranje tabele za klijente
CREATE TABLE klijenti (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naziv TEXT NOT NULL,
    adresa TEXT,
    kontakt_osoba TEXT,
    telefon TEXT,
    email TEXT,
    napomene TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kreiranje tabele za poslove
CREATE TABLE poslovi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    klijent_id UUID REFERENCES klijenti(id) ON DELETE SET NULL,
    opis_zadatka TEXT NOT NULL,
    datum_prijema DATE,
    planirani_datum DATE,
    prioritet TEXT CHECK (prioritet IN ('hitno', 'normalno', 'moze_sacekati')) DEFAULT 'normalno',
    status TEXT CHECK (status IN ('na_cekanju', 'u_toku', 'zavrseno', 'naplaceno')) DEFAULT 'na_cekanju',
    procenjena_cena NUMERIC,
    sta_je_uradjeno TEXT,
    datum_izvrsenja DATE,
    vreme_rada NUMERIC,
    materijali_cena NUMERIC,
    ukupan_iznos NUMERIC,
    naplaceno BOOLEAN DEFAULT FALSE,
    datum_naplate DATE,
    nacin_placanja TEXT CHECK (nacin_placanja IN ('gotovina', 'kartica', 'uplata')),
    fotografije_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kreiranje tabele za globalne postavke
CREATE TABLE postavke (
    id SERIAL PRIMARY KEY,
    kljuc TEXT UNIQUE NOT NULL,
    vrednost TEXT
);

-- Inicijalna vrednost za cenu sata
INSERT INTO postavke (kljuc, vrednost) VALUES ('cena_sata', '20');

-- Funkcija za automatsko ažuriranje updated_at polja
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triger koji poziva funkciju pre svakog ažuriranja
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON poslovi
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Dozvole za anon ključ
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE klijenti TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE poslovi TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE postavke TO anon;

-- Omogućavanje Row Level Security
ALTER TABLE klijenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE poslovi ENABLE ROW LEVEL SECURITY;
ALTER TABLE postavke ENABLE ROW LEVEL SECURITY;

-- Polise koje omogućavaju pristup podacima (primer - omogućava sve)
-- U produkciji bi trebalo definisati striktnije polise
CREATE POLICY "Allow all access" ON klijenti FOR ALL USING (true);
CREATE POLICY "Allow all access" ON poslovi FOR ALL USING (true);
CREATE POLICY "Allow all access" ON postavke FOR ALL USING (true);

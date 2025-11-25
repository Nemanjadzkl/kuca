-- Kreiranje tabele za klijente
CREATE TABLE klijenti (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naziv TEXT NOT NULL,
    adresa TEXT,
    kontakt_osoba TEXT,
    telefon TEXT,
    email TEXT,
    napomene TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Omogucavanje RLS za klijente
ALTER TABLE klijenti ENABLE ROW LEVEL SECURITY;

-- RLS pravilo koje dozvoljava sve operacije za sve korisnike
CREATE POLICY "Allow all operations" ON klijenti FOR ALL
USING (true)
WITH CHECK (true);

-- Kreiranje tabele za poslove
CREATE TABLE poslovi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    klijent_id UUID REFERENCES klijenti(id) ON DELETE SET NULL,
    opis_zadatka TEXT NOT NULL,
    datum_prijema DATE,
    planirani_datum DATE,
    prioritet TEXT CHECK (prioritet IN ('hitno', 'normalno', 'moze_sacekati')),
    status TEXT CHECK (status IN ('na_cekanju', 'u_toku', 'zavrseno', 'naplaceno')),
    procenjena_cena NUMERIC,
    sta_je_uradjeno TEXT,
    datum_izvrsenja DATE,
    materijali_cena NUMERIC,
    izlazak_na_teren NUMERIC,
    bosko NUMERIC,
    ukupan_iznos NUMERIC,
    naplaceno BOOLEAN DEFAULT false,
    datum_naplate DATE,
    nacin_placanja TEXT CHECK (nacin_placanja IN ('gotovina', 'kartica', 'uplata')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Omogucavanje RLS za poslove
ALTER TABLE poslovi ENABLE ROW LEVEL SECURITY;

-- RLS pravilo koje dozvoljava sve operacije za sve korisnike
CREATE POLICY "Allow all operations" ON poslovi FOR ALL
USING (true)
WITH CHECK (true);

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
EXECUTE PROCEDURE trigger_set_timestamp();

-- Funkcija za generisanje finansijskog izveštaja
CREATE OR REPLACE FUNCTION get_financial_report(period_option TEXT)
RETURNS TABLE(total_zarada NUMERIC, total_poslova BIGINT, total_dugovanja NUMERIC) AS $$
DECLARE
    start_date DATE;
    end_date DATE;
BEGIN
    CASE period_option
        WHEN 'tekuci_mesec' THEN
            start_date := date_trunc('month', current_date);
            end_date := (date_trunc('month', current_date) + interval '1 month - 1 day');
        WHEN 'prosli_mesec' THEN
            start_date := date_trunc('month', current_date) - interval '1 month';
            end_date := (date_trunc('month', current_date) - interval '1 day');
        WHEN 'tekuca_godina' THEN
            start_date := date_trunc('year', current_date);
            end_date := (date_trunc('year', current_date) + interval '1 year - 1 day');
    END CASE;

    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN status = 'naplaceno' AND datum_naplate BETWEEN start_date AND end_date THEN ukupan_iznos ELSE 0 END), 0) as total_zarada,
        COUNT(CASE WHEN datum_prijema BETWEEN start_date AND end_date THEN id END) as total_poslova,
        COALESCE(SUM(CASE WHEN status = 'zavrseno' AND naplaceno = false THEN ukupan_iznos ELSE 0 END), 0) as total_dugovanja
    FROM poslovi;
END;
$$ LANGUAGE plpgsql;

-- Funkcija za generisanje rang liste klijenata po zaradi
CREATE OR REPLACE FUNCTION get_client_leaderboard()
RETURNS TABLE(naziv_klijenta TEXT, total_zarada NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        k.naziv,
        COALESCE(SUM(p.ukupan_iznos), 0) as total_zarada
    FROM
        klijenti k
    JOIN
        poslovi p ON k.id = p.klijent_id
    WHERE
        p.status = 'naplaceno'
    GROUP BY
        k.naziv
    ORDER BY
        total_zarada DESC;
END;
$$ LANGUAGE plpgsql;

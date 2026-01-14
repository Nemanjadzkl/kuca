# MajstorApp

Web aplikacija za upravljanje poslovima kućnog majstora.

## Pokretanje projekta

### 1. Kloniranje repozitorijuma

```bash
git clone <URL_REPOZITORIJUMA>
cd majstor-app
```

### 2. Instalacija zavisnosti

```bash
npm install
```

### 3. Podešavanje Supabase

1.  Kreirajte projekat na [Supabase](https://supabase.com/).
2.  U SQL Editoru, izvršite skriptu iz `schema.sql` fajla.
3.  Kreirajte `.env.local` fajl u korenu projekta i dodajte vaše Supabase kredencijale:

```
NEXT_PUBLIC_SUPABASE_URL=VAŠ_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=VAŠ_SUPABASE_ANON_KEY
```

### 4. Pokretanje razvojnog servera

```bash
npm run dev
```

Aplikacija će biti dostupna na [http://localhost:3000](http://localhost:3000).

### Kredencijali za prijavu

-   **Korisničko ime:** Rados
-   **Lozinka:** Kodar123

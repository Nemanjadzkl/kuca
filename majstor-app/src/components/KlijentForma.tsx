"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface KlijentFormaProps {
  klijent?: any;
  onSuccess: () => void;
}

export default function KlijentForma({ klijent, onSuccess }: KlijentFormaProps) {
  const [naziv, setNaziv] = useState('');
  const [adresa, setAdresa] = useState('');
  const [kontaktOsoba, setKontaktOsoba] = useState('');
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [napomene, setNapomene] = useState('');

  useEffect(() => {
    if (klijent) {
      setNaziv(klijent.naziv);
      setAdresa(klijent.adresa);
      setKontaktOsoba(klijent.kontakt_osoba);
      setTelefon(klijent.telefon);
      setEmail(klijent.email);
      setNapomene(klijent.napomene);
    }
  }, [klijent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = klijent
      ? await supabase.from('klijenti').update({ naziv, adresa, kontakt_osoba: kontaktOsoba, telefon, email, napomene }).eq('id', klijent.id)
      : await supabase.from('klijenti').insert([{ naziv, adresa, kontakt_osoba: kontaktOsoba, telefon, email, napomene }]);

    if (!error) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded-lg shadow-md">
      <input type="text" placeholder="Naziv" value={naziv} onChange={(e) => setNaziv(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
      <input type="text" placeholder="Adresa" value={adresa} onChange={(e) => setAdresa(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
      <input type="text" placeholder="Kontakt osoba" value={kontaktOsoba} onChange={(e) => setKontaktOsoba(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
      <input type="text" placeholder="Telefon" value={telefon} onChange={(e) => setTelefon(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
      <textarea placeholder="Napomene" value={napomene} onChange={(e) => setNapomene(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
      <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        {klijent ? 'Sačuvaj izmene' : 'Dodaj klijenta'}
      </button>
    </form>
  );
}

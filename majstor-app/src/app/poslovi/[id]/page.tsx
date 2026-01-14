"use client";

import withAuth from '@/components/withAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import Link from 'next/link';

function DetaljiPoslaPage() {
  const { id } = useParams();
  const [posao, setPosao] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosao() {
      if (id) {
        const { data, error } = await supabase
          .from('poslovi')
          .select('*, klijenti(*)')
          .eq('id', id)
          .single();

        if (error) console.error('Error fetching posao:', error);
        else setPosao(data);
      }
      setLoading(false);
    }
    fetchPosao();
  }, [id]);

  if (loading) return <p>Učitavanje...</p>;
  if (!posao) return <p>Posao nije pronađen.</p>;

  return (
    <div className="container p-4 mx-auto">
      <Link href="/poslovi" className="mb-4 text-blue-600 hover:underline">&larr; Nazad na poslove</Link>
      <div className="p-6 mt-4 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-3xl font-bold">{posao.opis_zadatka}</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Detalji o klijentu</h2>
            <p><strong>Naziv:</strong> {posao.klijenti?.naziv}</p>
            <p><strong>Adresa:</strong> {posao.klijenti?.adresa}</p>
            <p><strong>Kontakt:</strong> {posao.klijenti?.kontakt_osoba} ({posao.klijenti?.telefon})</p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">Finansije (RSD)</h2>
            <p><strong>Procenjena cena:</strong> {posao.procenjena_cena}</p>
            <p><strong>Materijali:</strong> {posao.materijali_cena}</p>
            <p><strong>Izlazak na teren:</strong> {posao.izlazak_na_teren}</p>
            <p><strong>Popust (Bosko):</strong> -{posao.bosko}</p>
            <p className="mt-2 text-xl font-bold"><strong>Ukupno:</strong> {posao.ukupan_iznos} RSD</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">Status i datumi</h2>
          <p><strong>Status:</strong> {posao.status}</p>
          <p><strong>Prioritet:</strong> {posao.prioritet}</p>
          <p><strong>Datum prijema:</strong> {posao.datum_prijema}</p>
          <p><strong>Planirani datum:</strong> {posao.planirani_datum}</p>
          <p><strong>Datum izvršenja:</strong> {posao.datum_izvrsenja}</p>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">Opis izvršenih radova</h2>
          <p>{posao.sta_je_uradjeno || 'Nije uneto.'}</p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DetaljiPoslaPage);

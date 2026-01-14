"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PosaoFormaProps {
  posao?: any;
  onSuccess: () => void;
}

export default function PosaoForma({ posao, onSuccess }: PosaoFormaProps) {
  const [klijenti, setKlijenti] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    klijent_id: '',
    opis_zadatka: '',
    datum_prijema: '',
    planirani_datum: '',
    prioritet: 'normalno',
    status: 'na_cekanju',
    procenjena_cena: 0,
    sta_je_uradjeno: '',
    datum_izvrsenja: '',
    materijali_cena: 0,
    izlazak_na_teren: 0,
    bosko: 0,
    ukupan_iznos: 0,
    naplaceno: false,
    datum_naplate: '',
    nacin_placanja: 'gotovina',
  });

  useEffect(() => {
    async function fetchKlijenti() {
      const { data } = await supabase.from('klijenti').select('id, naziv');
      setKlijenti(data || []);
    }
    fetchKlijenti();
  }, []);

  useEffect(() => {
    if (posao) {
      setFormData({
        ...posao,
        klijent_id: posao.klijent_id || '',
        procenjena_cena: posao.procenjena_cena || 0,
        materijali_cena: posao.materijali_cena || 0,
        izlazak_na_teren: posao.izlazak_na_teren || 0,
        bosko: posao.bosko || 0,
      });
    }
  }, [posao]);

  useEffect(() => {
    const total = (Number(formData.procenjena_cena) || 0) + (Number(formData.materijali_cena) || 0) + (Number(formData.izlazak_na_teren) || 0) - (Number(formData.bosko) || 0);
    setFormData(prev => ({ ...prev, ukupan_iznos: total }));
  }, [formData.procenjena_cena, formData.materijali_cena, formData.izlazak_na_teren, formData.bosko]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = posao
      ? await supabase.from('poslovi').update(formData).eq('id', posao.id)
      : await supabase.from('poslovi').insert([formData]);

    if (!error) {
      onSuccess();
    } else {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded-lg shadow-md">
      <select name="klijent_id" value={formData.klijent_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required>
        <option value="">Izaberi klijenta</option>
        {klijenti.map(k => <option key={k.id} value={k.id}>{k.naziv}</option>)}
      </select>
      <textarea name="opis_zadatka" placeholder="Opis zadatka" value={formData.opis_zadatka} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
      <input type="date" name="datum_prijema" value={formData.datum_prijema} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
      <input type="number" name="procenjena_cena" placeholder="Procenjena cena" value={formData.procenjena_cena} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
      <input type="number" name="materijali_cena" placeholder="Troškovi materijala" value={formData.materijali_cena} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
      <input type="number" name="izlazak_na_teren" placeholder="Izlazak na teren" value={formData.izlazak_na_teren} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
      <input type="number" name="bosko" placeholder="Bosko" value={formData.bosko} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
      <input type="number" name="ukupan_iznos" placeholder="Ukupan iznos" value={formData.ukupan_iznos} className="w-full px-3 py-2 border rounded-md bg-gray-200" readOnly />
      <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">{posao ? 'Sačuvaj izmene' : 'Dodaj posao'}</button>
    </form>
  );
}

"use client";

import withAuth from '@/components/withAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import PosaoForma from '@/components/PosaoForma';
import Link from 'next/link';

function PosloviPage() {
  const [poslovi, setPoslovi] = useState<any[]>([]);
  const [klijenti, setKlijenti] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPosao, setSelectedPosao] = useState<any | null>(null);
  const [filters, setFilters] = useState({ status: '', klijent_id: '' });

  async function fetchPoslovi() {
    setLoading(true);
    let query = supabase.from('poslovi').select('*, klijenti(naziv)');
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.klijent_id) query = query.eq('klijent_id', filters.klijent_id);

    const { data, error } = await query;
    if (error) console.error('Error fetching poslovi:', error);
    else setPoslovi(data);
    setLoading(false);
  }

  useEffect(() => {
    async function fetchKlijenti() {
      const { data } = await supabase.from('klijenti').select('id, naziv');
      setKlijenti(data || []);
    }
    fetchKlijenti();
    fetchPoslovi();
  }, [filters]);

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedPosao(null);
    fetchPoslovi();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete posao?')) {
      const { error } = await supabase.from('poslovi').delete().eq('id', id);
      if (!error) fetchPoslovi();
    }
  };

  const handleEdit = (posao: any) => {
    setSelectedPosao(posao);
    setShowForm(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return <p>Učitavanje...</p>;

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Poslovi</h1>
        <button onClick={() => { setShowForm(!showForm); setSelectedPosao(null); }} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          {showForm ? 'Zatvori' : 'Dodaj posao'}
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <select name="status" value={filters.status} onChange={handleFilterChange} className="px-3 py-2 border rounded-md">
          <option value="">Svi statusi</option>
          <option value="na_cekanju">Na čekanju</option>
          <option value="u_toku">U toku</option>
          <option value="zavrseno">Završeno</option>
          <option value="naplaceno">Naplaćeno</option>
        </select>
        <select name="klijent_id" value={filters.klijent_id} onChange={handleFilterChange} className="px-3 py-2 border rounded-md">
          <option value="">Svi klijenti</option>
          {klijenti.map(k => <option key={k.id} value={k.id}>{k.naziv}</option>)}
        </select>
      </div>
      {showForm && <PosaoForma posao={selectedPosao} onSuccess={handleSuccess} />}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {poslovi.map((posao) => (
          <div key={posao.id} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{posao.opis_zadatka}</h2>
            <p>Klijent: {posao.klijenti?.naziv || 'N/A'}</p>
            <p>Status: {posao.status}</p>
            <p>Ukupno: {posao.ukupan_iznos} RSD</p>
            <div className="flex justify-end mt-4 space-x-2">
              <Link href={`/poslovi/${posao.id}`} className="px-3 py-1 text-sm text-white bg-green-500 rounded-md">Detalji</Link>
              <button onClick={() => handleEdit(posao)} className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-md">Izmeni</button>
              <button onClick={() => handleDelete(posao.id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded-md">Obriši</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(PosloviPage);

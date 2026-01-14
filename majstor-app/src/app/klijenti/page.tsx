"use client";

import withAuth from '@/components/withAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import KlijentForma from '@/components/KlijentForma';

function KlijentiPage() {
  const [klijenti, setKlijenti] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedKlijent, setSelectedKlijent] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  async function fetchKlijenti() {
    setLoading(true);
    let query = supabase.from('klijenti').select('*');
    if (searchTerm) {
      query = query.or(`naziv.ilike.%${searchTerm}%,adresa.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching klijenti:', error);
    } else {
      setKlijenti(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchKlijenti();
  }, [searchTerm]);

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedKlijent(null);
    fetchKlijenti();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete klijenta?')) {
      const { error } = await supabase.from('klijenti').delete().eq('id', id);
      if (!error) {
        fetchKlijenti();
      }
    }
  };

  const handleEdit = (klijent: any) => {
    setSelectedKlijent(klijent);
    setShowForm(true);
  };

  if (loading) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Klijenti</h1>
        <button onClick={() => { setShowForm(!showForm); setSelectedKlijent(null); }} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          {showForm ? 'Zatvori' : 'Dodaj klijenta'}
        </button>
      </div>
      <input
        type="text"
        placeholder="Pretraga po nazivu ili adresi..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-4 border rounded-md"
      />
      {showForm && <KlijentForma klijent={selectedKlijent} onSuccess={handleSuccess} />}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {klijenti.map((klijent) => (
          <div key={klijent.id} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{klijent.naziv}</h2>
            <p>{klijent.adresa}</p>
            <p>{klijent.telefon}</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => handleEdit(klijent)} className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-md">Izmeni</button>
              <button onClick={() => handleDelete(klijent.id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded-md">Obriši</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(KlijentiPage);

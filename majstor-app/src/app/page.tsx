"use client";

import withAuth from '@/components/withAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function HomePage() {
  const router = useRouter();
  const [aktivniZadaci, setAktivniZadaci] = useState<any[]>([]);
  const [nenaplaceniPoslovi, setNenaplaceniPoslovi] = useState<any[]>([]);
  const [mesecnaZarada, setMesecnaZarada] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

      // Aktivni zadaci
      const { data: aktivni } = await supabase.from('poslovi').select('*').in('status', ['na_cekanju', 'u_toku']);
      setAktivniZadaci(aktivni || []);

      // Nenaplaćeni poslovi
      const { data: nenaplaceni } = await supabase.from('poslovi').select('*').eq('status', 'zavrseno').eq('naplaceno', false);
      setNenaplaceniPoslovi(nenaplaceni || []);

      // Mesečna zarada
      const { data: zarada } = await supabase.from('poslovi').select('ukupan_iznos').eq('status', 'naplaceno').gte('datum_naplate', firstDayOfMonth);
      const total = zarada?.reduce((acc, p) => acc + p.ukupan_iznos, 0) || 0;
      setMesecnaZarada(total);
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">Odjavi se</button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-bold">Aktivni zadaci ({aktivniZadaci.length})</h2>
          <ul>{aktivniZadaci.map(p => <li key={p.id}>{p.opis_zadatka}</li>)}</ul>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-bold">Nenaplaćeni poslovi ({nenaplaceniPoslovi.length})</h2>
          <ul>{nenaplaceniPoslovi.map(p => <li key={p.id}>{p.opis_zadatka} - {p.ukupan_iznos} RSD</li>)}</ul>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-bold">Zarada ovog meseca</h2>
          <p className="text-3xl font-bold">{mesecnaZarada} RSD</p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomePage);

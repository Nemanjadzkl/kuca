"use client";

import withAuth from '@/components/withAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function IzvestajiPage() {
  const [period, setPeriod] = useState('tekuci_mesec');
  const [report, setReport] = useState({ zarada: 0, brojPoslova: 0, dugovanja: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      const { data } = await supabase.rpc('get_financial_report', { period_option: period });
      if (data) {
        setReport({
          zarada: data[0].total_zarada,
          brojPoslova: data[0].total_poslova,
          dugovanja: data[0].total_dugovanja
        });
      }
      setLoading(false);
    }
    fetchReport();
  }, [period]);

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Izveštaji</h1>
      <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-2 mb-4 border rounded-md">
        <option value="tekuci_mesec">Tekući mesec</option>
        <option value="prosli_mesec">Prošli mesec</option>
        <option value="tekuca_godina">Tekuća godina</option>
      </select>
      {loading ? <p>Učitavanje...</p> : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Ukupna zarada</h2>
            <p className="text-3xl font-bold">{report.zarada} RSD</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Broj poslova</h2>
            <p className="text-3xl font-bold">{report.brojPoslova}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Dugovanja</h2>
            <p className="text-3xl font-bold">{report.dugovanja} RSD</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(IzvestajiPage);

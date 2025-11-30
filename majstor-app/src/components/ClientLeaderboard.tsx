"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface LeaderboardEntry {
  naziv_klijenta: string;
  total_zarada: number;
}

export default function ClientLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_client_leaderboard');
      if (data) {
        setLeaderboard(data);
      }
      if (error) {
        console.error('Greška pri dohvatanju rang liste klijenata:', error);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p>Učitavanje rang liste klijenata...</p>;
  }

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold">Rang lista klijenata po zaradi</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Klijent</th>
            <th className="px-4 py-2 text-right">Ukupna zarada</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{entry.naziv_klijenta}</td>
              <td className="px-4 py-2 text-right">{entry.total_zarada.toFixed(2)} RSD</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

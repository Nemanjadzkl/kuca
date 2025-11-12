"use client";

import withAuth from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job } from '../jobs/page';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeJobs: 0,
    unpaidJobs: 0,
    upcomingJobs: 0,
    monthlyEarnings: 0,
  });
  const [upcomingJobsList, setUpcomingJobsList] = useState<Job[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: jobs, error } = await supabase.from('poslovi').select('*');
    if (jobs) {
      const active = jobs.filter(j => j.status === 'na_cekanju' || j.status === 'u_toku').length;
      const unpaid = jobs.filter(j => !j.naplaceno && j.status === 'zavrseno').length;

      const today = new Date();
      const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      const upcoming = jobs.filter(j => {
        const planDate = new Date(j.planirani_datum);
        return planDate >= today && planDate <= nextWeek;
      });

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthly = jobs
        .filter(j => j.naplaceno && new Date(j.datum_naplate) >= startOfMonth)
        .reduce((sum, j) => sum + (j.ukupan_iznos || 0), 0);

      setStats({
        activeJobs: active,
        unpaidJobs: unpaid,
        upcomingJobs: upcoming.length,
        monthlyEarnings: monthly,
      });
      setUpcomingJobsList(upcoming as any);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="p-4 sm:p-8">
      <header className="flex flex-wrap justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold">MajstorApp</h1>
        <nav className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
          <Link href="/clients" data-testid="clients-link"><Button variant="link">Klijenti</Button></Link>
          <Link href="/jobs" data-testid="jobs-link"><Button variant="link">Poslovi</Button></Link>
          <Link href="/reports" data-testid="reports-link"><Button variant="link">Izveštaji</Button></Link>
          <Button onClick={handleLogout} variant="destructive">Odjavi se</Button>
        </nav>
      </header>
      <main>
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader><CardTitle>Aktivni zadaci</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{stats.activeJobs}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Nenaplaćeni poslovi</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{stats.unpaidJobs}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Zarada (tekući mesec)</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{stats.monthlyEarnings} €</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Predstojeći poslovi (7 dana)</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{stats.upcomingJobs}</p></CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Predstojeći poslovi</h3>
          <Card>
            <CardContent className="pt-6">
              {upcomingJobsList.length > 0 ? (
                <ul>
                  {upcomingJobsList.map(job => (
                    <li key={job.id} className="mb-2 p-2 border-b">
                      <p className="font-semibold">{job.opis_zadatka}</p>
                      <p className="text-sm text-gray-500">Planirano za: {new Date(job.planirani_datum).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nema predstojećih poslova u narednih 7 dana.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default withAuth(HomePage);

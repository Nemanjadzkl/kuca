"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import withAuth from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import { Job } from '../jobs/page';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function ReportsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState<{ jobs: Job[], total: number, unpaid: number }>({ jobs: [], total: 0, unpaid: 0 });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data } = await supabase.from('poslovi').select('*, klijenti(naziv)');
    if (data) setJobs(data as any);
  };

  const generateReport = () => {
    const filteredJobs = jobs.filter(job => {
      const jobDate = new Date(job.datum_izvrsenja);
      return jobDate.getMonth() + 1 === selectedMonth && jobDate.getFullYear() === selectedYear;
    });

    const total = filteredJobs.reduce((sum, job) => sum + (job.ukupan_iznos || 0), 0);
    const unpaid = filteredJobs.filter(j => !j.naplaceno).reduce((sum, job) => sum + (job.ukupan_iznos || 0), 0);

    setReportData({ jobs: filteredJobs, total, unpaid });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8 no-print">
        <h1 className="text-3xl font-bold">Mesečni izveštaj</h1>
        <div className="flex gap-4 items-center">
          <Input type="number" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} placeholder="Mesec" />
          <Input type="number" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} placeholder="Godina" />
          <Button onClick={generateReport}>Generiši izveštaj</Button>
          <Button onClick={handlePrint} variant="outline">Štampaj</Button>
        </div>
      </div>

      <div className="printable">
        <h2 className="text-2xl font-semibold mb-4">Izveštaj za {selectedMonth}/{selectedYear}</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
            <p><strong>Ukupna zarada:</strong> {reportData.total} €</p>
            <p><strong>Ukupno dugovanje:</strong> {reportData.unpaid} €</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Klijent</TableHead>
              <TableHead>Opis</TableHead>
              <TableHead>Datum izvršenja</TableHead>
              <TableHead>Iznos</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.jobs.map(job => (
              <TableRow key={job.id}>
                <TableCell>{job.klijenti?.naziv}</TableCell>
                <TableCell>{job.opis_zadatka}</TableCell>
                <TableCell>{new Date(job.datum_izvrsenja).toLocaleDateString()}</TableCell>
                <TableCell>{job.ukupan_iznos} €</TableCell>
                <TableCell>{job.naplaceno ? 'Naplaćeno' : 'Nije naplaćeno'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none; }
          .printable {
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}

// Input component is missing, let me create a simple one for now.
function Input(props: any) {
  return <input {...props} className="border p-2 rounded" />;
}

export default withAuth(ReportsPage);

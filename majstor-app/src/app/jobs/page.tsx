"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from './data-table';
import { columns } from './columns';
import withAuth from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import JobForm from './job-form';
import Spinner from '@/components/ui/spinner';

export type Job = {
  id: string;
  klijent_id: string;
  opis_zadatka: string;
  datum_prijema: string;
  planirani_datum: string;
  prioritet: 'hitno' | 'normalno' | 'moze_sacekati';
  status: 'na_cekanju' | 'u_toku' | 'zavrseno' | 'naplaceno';
  procenjena_cena: number;
  sta_je_uradjeno: string;
  datum_izvrsenja: string;
  vreme_rada: number;
  materijali_cena: number;
  ukupan_iznos: number;
  naplaceno: boolean;
  datum_naplate: string;
  nacin_placanja: 'gotovina' | 'kartica' | 'uplata';
  klijenti: { naziv: string };
};

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('poslovi')
      .select('*, klijenti(naziv)');
    if (data) setJobs(data as any);
    setLoading(false);
  };

  const handleFormSubmit = () => {
    fetchJobs();
    setIsFormOpen(false);
    setSelectedJob(null);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj posao?')) {
      await supabase.from('poslovi').delete().eq('id', id);
      fetchJobs();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Poslovi</h1>
        <Button onClick={() => {
          setSelectedJob(null);
          setIsFormOpen(true);
        }}>Dodaj novi posao</Button>
      </div>
      {loading ? <Spinner /> : (
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={jobs}
        />
      )}
      <JobForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        job={selectedJob}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default withAuth(JobsPage);

"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from './data-table';
import { columns } from './columns';
import withAuth from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import ClientForm from './client-form';
import Spinner from '@/components/ui/spinner';

export type Client = {
  id: string;
  naziv: string;
  adresa: string;
  kontakt_osoba: string;
  telefon: string;
  email: string;
  napomene: string;
};

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('klijenti').select('*');
    if (data) setClients(data);
    setLoading(false);
  };

  const handleFormSubmit = () => {
    fetchClients();
    setIsFormOpen(false);
    setSelectedClient(null);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog klijenta?')) {
      await supabase.from('klijenti').delete().eq('id', id);
      fetchClients();
    }
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Klijenti</h1>
        <Button onClick={() => {
          setSelectedClient(null);
          setIsFormOpen(true);
        }}>Dodaj novog klijenta</Button>
      </div>
      {loading ? <Spinner /> : (
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={clients}
        />
      )}
      <ClientForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        client={selectedClient}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default withAuth(ClientsPage);

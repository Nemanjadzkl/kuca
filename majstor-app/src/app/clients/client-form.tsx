"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Client } from './page';
import { toast } from "sonner"

type ClientFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  client: Client | null;
  onSubmit: () => void;
};

export default function ClientForm({ isOpen, onOpenChange, client, onSubmit }: ClientFormProps) {
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    naziv: '',
    adresa: '',
    kontakt_osoba: '',
    telefon: '',
    email: '',
    napomene: '',
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        naziv: '',
        adresa: '',
        kontakt_osoba: '',
        telefon: '',
        email: '',
        napomene: '',
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      // Update
      await supabase.from('klijenti').update(formData).eq('id', client.id);
      toast.success("Klijent je uspešno sačuvan.");
    } else {
      // Create
      await supabase.from('klijenti').insert(formData);
      toast.success("Novi klijent je uspešno dodat.");
    }
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Izmeni klijenta' : 'Dodaj novog klijenta'}</DialogTitle>
          <DialogDescription>
            {client ? 'Izmenite podatke o klijentu.' : 'Unesite podatke za novog klijenta.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="naziv" className="text-right">
              Naziv
            </Label>
            <Input id="naziv" value={formData.naziv} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adresa" className="text-right">
              Adresa
            </Label>
            <Input id="adresa" value={formData.adresa} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kontakt_osoba" className="text-right">
              Kontakt
            </Label>
            <Input id="kontakt_osoba" value={formData.kontakt_osoba} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefon" className="text-right">
              Telefon
            </Label>
            <Input id="telefon" value={formData.telefon} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="napomene" className="text-right">
              Napomene
            </Label>
            <Input id="napomene" value={formData.napomene} onChange={handleChange} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit">Sačuvaj</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

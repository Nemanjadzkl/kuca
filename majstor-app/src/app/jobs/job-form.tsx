"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job } from './page';
import { Client } from '../clients/page';
import { toast } from "sonner"

type JobFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  job: Job | null;
  onSubmit: () => void;
};

export default function JobForm({ isOpen, onOpenChange, job, onSubmit }: JobFormProps) {
  const [formData, setFormData] = useState<Partial<Job>>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchHourlyRate();
    if (job) {
      setFormData(job);
    } else {
      setFormData({
        klijent_id: '',
        opis_zadatka: '',
        status: 'na_cekanju',
        prioritet: 'normalno',
        naplaceno: false,
        vreme_rada: 0,
        materijali_cena: 0,
        ukupan_iznos: 0,
        fotografije_urls: [],
      });
    }
  }, [job]);

  const fetchClients = async () => {
    const { data } = await supabase.from('klijenti').select('*');
    if (data) setClients(data);
  };

  const fetchHourlyRate = async () => {
    const { data } = await supabase.from('postavke').select('vrednost').eq('kljuc', 'cena_sata').single();
    if (data) setHourlyRate(parseFloat(data.vrednost));
  };

  const calculateTotal = useCallback(() => {
    const workHours = Number(formData.vreme_rada) || 0;
    const materialsCost = Number(formData.materijali_cena) || 0;
    const total = (workHours * hourlyRate) + materialsCost;
    setFormData(prev => ({ ...prev, ukupan_iznos: total }));
  }, [formData.vreme_rada, formData.materijali_cena, hourlyRate]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (id: keyof Job, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`; // bucket 'fotografije' je public po defaultu
      let { error: uploadError } = await supabase.storage.from('fotografije').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('fotografije').getPublicUrl(filePath);
      const newUrls = [...(formData.fotografije_urls || []), data.publicUrl];
      setFormData(prev => ({...prev, fotografije_urls: newUrls}));

    } catch (error) {
      alert('Error uploading file!');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (job) {
      await supabase.from('poslovi').update(formData).eq('id', job.id);
      toast.success("Posao je uspešno sačuvan.");
    } else {
      await supabase.from('poslovi').insert(formData);
      toast.success("Novi posao je uspešno dodat.");
    }
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader><DialogTitle>{job ? 'Izmeni posao' : 'Dodaj novi posao'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-6">
          <Select onValueChange={(value) => handleSelectChange('klijent_id', value)} value={formData.klijent_id}>
            <SelectTrigger><SelectValue placeholder="Izaberite klijenta" /></SelectTrigger>
            <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.naziv}</SelectItem>)}</SelectContent>
          </Select>

          <Input id="opis_zadatka" value={formData.opis_zadatka} onChange={handleChange} required placeholder="Opis zadatka"/>

          <div className="grid grid-cols-2 gap-4">
            <Input id="datum_prijema" type="date" value={formData.datum_prijema} onChange={handleChange} />
            <Input id="planirani_datum" type="date" value={formData.planirani_datum} onChange={handleChange} />
          </div>

          <Select onValueChange={(value) => handleSelectChange('prioritet', value)} value={formData.prioritet}>
            <SelectTrigger><SelectValue placeholder="Prioritet" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="normalno">Normalno</SelectItem>
              <SelectItem value="hitno">Hitno</SelectItem>
              <SelectItem value="moze_sacekati">Može sačekati</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="na_cekanju">Na čekanju</SelectItem>
              <SelectItem value="u_toku">U toku</SelectItem>
              <SelectItem value="zavrseno">Završeno</SelectItem>
              <SelectItem value="naplaceno">Naplaćeno</SelectItem>
            </SelectContent>
          </Select>

          <Input id="sta_je_uradjeno" value={formData.sta_je_uradjeno} onChange={handleChange} placeholder="Šta je urađeno" />

          <div className="grid grid-cols-2 gap-4">
            <Input id="vreme_rada" type="number" value={formData.vreme_rada} onChange={handleChange} placeholder="Vreme rada (sati)" />
            <Input id="materijali_cena" type="number" value={formData.materijali_cena} onChange={handleChange} placeholder="Cena materijala" />
          </div>

          <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-center">
            <Label>Ukupan iznos: {formData.ukupan_iznos} €</Label>
          </div>

          <div>
            <Label htmlFor="photos">Fotografije</Label>
            <Input id="photos" type="file" onChange={handleFileUpload} disabled={uploading} />
            {uploading && <p>Uploading...</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.fotografije_urls?.map(url => (
                <img key={url} src={url} alt="Fotografija posla" width={100} className="rounded" />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input id="naplaceno" type="checkbox" checked={!!formData.naplaceno} onChange={handleChange} />
            <Label htmlFor="naplaceno">Naplaćeno</Label>
          </div>

          {formData.naplaceno && (
             <div className="grid grid-cols-2 gap-4">
               <Input id="datum_naplate" type="date" value={formData.datum_naplate} onChange={handleChange} />
               <Select onValueChange={(value) => handleSelectChange('nacin_placanja', value)} value={formData.nacin_placanja}>
                  <SelectTrigger><SelectValue placeholder="Način plaćanja" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gotovina">Gotovina</SelectItem>
                    <SelectItem value="kartica">Kartica</SelectItem>
                    <SelectItem value="uplata">Uplata</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter><Button type="submit">Sačuvaj</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

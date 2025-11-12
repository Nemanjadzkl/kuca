"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Job } from "./page"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

type ColumnsProps = {
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
};

const statusColors: Record<Job['status'], string> = {
  na_cekanju: 'bg-yellow-500',
  u_toku: 'bg-blue-500',
  zavrseno: 'bg-green-500',
  naplaceno: 'bg-purple-500',
};

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Job>[] => [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className="flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${statusColors[status]}`} />
          {status}
        </span>
      )
    }
  },
  {
    accessorKey: "klijenti.naziv",
    header: "Klijent",
  },
  {
    accessorKey: "opis_zadatka",
    header: "Opis",
  },
  {
    accessorKey: "planirani_datum",
    header: "Planirani Datum",
    cell: ({ row }) => new Date(row.original.planirani_datum).toLocaleDateString(),
  },
  {
    accessorKey: "ukupan_iznos",
    header: "Iznos",
    cell: ({ row }) => `${row.original.ukupan_iznos || 0} €`,
  },
  {
    accessorKey: "naplaceno",
    header: "Naplaćeno",
    cell: ({ row }) => (row.original.naplaceno ? "Da" : "Ne"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Otvori meni</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akcije</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(job)}>
              Izmeni / Pregledaj
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(job.id)}>
              Obriši
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

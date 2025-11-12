"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Client } from "./page"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

type ColumnsProps = {
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
};

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Client>[] => [
  {
    accessorKey: "naziv",
    header: "Naziv",
  },
  {
    accessorKey: "adresa",
    header: "Adresa",
  },
  {
    accessorKey: "kontakt_osoba",
    header: "Kontakt Osoba",
  },
  {
    accessorKey: "telefon",
    header: "Telefon",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original

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
            <DropdownMenuItem onClick={() => onEdit(client)}>
              Izmeni
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(client.id)}>
              Obriši
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

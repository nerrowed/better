import type { LecturersRecord } from "@/types/pocketbase";
import type { ColumnDef } from "@tanstack/react-table";

export const TABLE_COL: ColumnDef<LecturersRecord>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "nip",
    header: "NIP",
    enableSorting: true,
  },
  {
    accessorKey: "nidn",
    header: "NIDN",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

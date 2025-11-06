// src/app/dashboard/plotting/request-lecture-plotting-page.columns.tsx

import type { LecturersAvailableViewRecord } from "@/types/pocketbase";
import type { ColumnDef } from "@tanstack/react-table";

export const TABLE_COL: ColumnDef<LecturersAvailableViewRecord>[] = [
  {
    accessorKey: "lecturerName",
    header: "Nama Mahasiswa",
  },
  {
    accessorKey: "lecturerNip",
    header: "NIP",
    enableSorting: true,
  },
  {
    accessorKey: "lecturerNidn",
    header: "NIDN",
    enableSorting: true,
  },
];

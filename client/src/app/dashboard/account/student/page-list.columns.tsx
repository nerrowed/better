import type { StudentsRecord } from "@/types/pocketbase";
import type { ColumnDef } from "@tanstack/react-table";

export const TABLE_COL: ColumnDef<StudentsRecord>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "nim",
    header: "NIM",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

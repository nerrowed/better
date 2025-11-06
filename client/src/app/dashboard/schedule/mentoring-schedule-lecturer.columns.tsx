import type { LecturerStudentsViewRecord } from "@/types/pocketbase";
import type { ColumnDef } from "@tanstack/react-table";

export const LECTURER_TABLE_COL: ColumnDef<LecturerStudentsViewRecord>[] = [
  {
    accessorKey: "studentName",
    header: "Nama Mahasiswa",
  },
  {
    accessorKey: "studentNim",
    header: "NIM",
    enableSorting: true,
  },
  {
    accessorKey: "lecturerRole",
    header: "Peran",
    cell: ({ getValue }) => {
      const role = getValue<string>();

      switch (role) {
        case "lecturer_1":
          return "Pembimbing 1";
        case "lecturer_2":
          return "Pembimbing 2";
        default:
          return role;
      }
    },
  },
];

export const STUDENT_TABLE_COL: ColumnDef<LecturerStudentsViewRecord>[] = [
  {
    accessorKey: "lecturerName",
    header: "Nama Dosen",
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
  {
    accessorKey: "lecturerRole",
    header: "Peran",
    cell: ({ getValue }) => {
      const role = getValue<string>();

      switch (role) {
        case "lecturer_1":
          return "Pembimbing 1";
        case "lecturer_2":
          return "Pembimbing 2";
        default:
          return role;
      }
    },
  },
];

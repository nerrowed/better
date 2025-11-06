import type { MergedFinaleExamSchedule } from '@/hooks/use-finale-examination-data';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const LECTURER_TABLE_COL: ColumnDef<MergedFinaleExamSchedule>[] = [
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(value, 'PPP');
    },
  },
  {
    accessorKey: 'start_time',
    header: 'Jam Mulai',
  },
  {
    accessorKey: 'end_time',
    header: 'Jam Selesai',
  },
  {
    accessorKey: 'room_name',
    header: 'Ruangan',
  },
  {
    accessorKey: 'students',
    header: 'Nama Mahasiswa',
    cell: ({ getValue }) => {
      const examiners = getValue<MergedFinaleExamSchedule['students']>();
      return examiners.map(student => {
        return (
          <div>
            {student.name} ({student.nim})
          </div>
        );
      });
    },
  },
];

export const STUDENT_TABLE_COL: ColumnDef<MergedFinaleExamSchedule>[] = [
  {
    accessorKey: 'examiners',
    header: 'Dosen Penguji',
    cell: ({ getValue }) => {
      const examiners = getValue<MergedFinaleExamSchedule['examiners']>();
      return examiners.map(examiner => {
        return (
          <div>
            {examiner.role_name} - {examiner.lecturer_name} - NIP.{examiner.lecturer_nip}
          </div>
        );
      });
    },
  },
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(value, 'PPP');
    },
  },
  {
    accessorKey: 'start_time',
    header: 'Jam Mulai',
  },
  {
    accessorKey: 'end_time',
    header: 'Jam Selesai',
  },
  {
    accessorKey: 'room_name',
    header: 'Ruangan',
  },
];

import type { FinaleExamRoomsRecord } from '@/types/pocketbase';
import type { ColumnDef } from '@tanstack/react-table';

export const TABLE_COL: ColumnDef<FinaleExamRoomsRecord>[] = [
  {
    accessorKey: 'room_name',
    header: 'Nama Ruangan',
  },
];

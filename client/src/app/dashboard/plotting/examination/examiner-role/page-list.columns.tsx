import type { FinaleExamExaminerRoleRecord } from '@/types/pocketbase';
import type { ColumnDef } from '@tanstack/react-table';

export const TABLE_COL: ColumnDef<FinaleExamExaminerRoleRecord>[] = [
  {
    accessorKey: 'role',
    header: 'Peran Penguji',
  },
];

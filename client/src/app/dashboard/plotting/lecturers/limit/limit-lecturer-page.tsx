// src/app/dashboard/plotting/mentoring-plotting-page.tsx
import { SimpleDataTable } from '@/components/tables/simple-data-table';
import usePocketbase from '@/hooks/use-pocketbase';
import type { LecturersRecord } from '@/types/pocketbase';
import { useEffect, useState } from 'react';
import { TABLE_COL } from './page-list.columns';
import ErrorCard from '@/components/cards/error-card';

export default function LimitLecturerPage() {
  const [lecturers, setLecturers] = useState<LecturersRecord[]>([]);
  const { isLoading, error, getRecords } = usePocketbase('lecturers');

  useEffect(() => {
    getRecords().then(setLecturers);
  }, []);

  if (error) return <ErrorCard />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center my-2">
        <h1 className="text-2xl font-bold">Limit Bimbingan Dosen</h1>
      </div>

      <SimpleDataTable isLoading={isLoading} columns={TABLE_COL} data={lecturers} />
    </div>
  );
}

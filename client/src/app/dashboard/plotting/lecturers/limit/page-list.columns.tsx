// src/app/dashboard/plotting/page-list.columns.tsx dan LimitInputCell.tsx (Digabungkan)

import { Input } from '@/components/ui/input';
import usePocketbase from '@/hooks/use-pocketbase';
import type { LecturersRecord, MentoringSchedulesLimitPerLecturerRecord } from '@/types/pocketbase';
import type { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface LimitInputCellProps {
  lecturerId: string;
}

function LimitInputCell({ lecturerId }: LimitInputCellProps) {
  const { updateRecord, getRecords, createRecord } = usePocketbase(
    'mentoring_schedules_limit_per_lecturer'
  );
  const [currentLimit, setCurrentLimit] = useState<number | undefined>(undefined);
  const [limitRecordId, setLimitRecordId] = useState<string | undefined>(undefined);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    getRecords({
      filter: `lecturer = '${lecturerId}'`,
      $autoCancel: false,
    }).then(async records => {
      if (records && records.length > 0) {
        const record = records[0] as MentoringSchedulesLimitPerLecturerRecord;
        setCurrentLimit(record.limit);
        setLimitRecordId(record.id);
      } else {
        const newRecord = await createRecord(
          {
            lecturer: lecturerId,
            limit: 0,
          },
          { $autoCancel: false }
        );
        setCurrentLimit(0);
        setLimitRecordId(newRecord.id);
      }
      isInitialLoad.current = false;
    });
  }, [lecturerId, getRecords, createRecord]);

  const handleSave = async (newLimit: number) => {
    if (!limitRecordId || isInitialLoad.current || newLimit === undefined || newLimit < 0) return;

    try {
      await updateRecord(limitRecordId, {
        limit: newLimit,
      });
      toast.success(`Limit (${newLimit}) berhasil disimpan.`);
    } catch (error) {
      toast.error('Gagal menyimpan perubahan.');
      console.error('Save error:', error);
    }
  };

  useEffect(() => {
    if (currentLimit === undefined) return;
    handleSave(currentLimit);
  }, [currentLimit]);

  if (currentLimit === undefined) {
    return <Input value="Memuat..." disabled />;
  }

  return (
    <Input
      type="number"
      value={currentLimit}
      className="max-w-20 text-center"
      onChange={e => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value >= 0) {
          setCurrentLimit(value);
        }
      }}
    />
  );
}

export const TABLE_COL: ColumnDef<LecturersRecord>[] = [
  {
    accessorKey: 'name',
    header: 'Nama',
  },
  {
    accessorKey: 'nip',
    header: 'NIP',
    enableSorting: true,
  },
  {
    accessorKey: 'id',
    header: 'Limit Jumlah Mahasiswa',
    cell: ({ getValue }) => {
      const id = getValue<LecturersRecord['id']>();
      return <LimitInputCell lecturerId={id} />;
    },
  },
];

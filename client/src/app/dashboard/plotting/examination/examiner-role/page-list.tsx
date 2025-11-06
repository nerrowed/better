import { SimpleDataTable } from '@/components/tables/simple-data-table';
import { TABLE_COL } from './page-list.columns';
import usePocketbase from '@/hooks/use-pocketbase';
import { useEffect, useState } from 'react';
import type { FinaleExamExaminerRoleRecord } from '@/types/pocketbase';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ListFinaleExamExaminerRole() {
  const navigate = useNavigate();
  const [finaleExamRooms, setFinaleExamRooms] = useState<FinaleExamExaminerRoleRecord[]>([]);
  const { getRecords, isLoading, deleteRecord } = usePocketbase('finale_exam_examiner_role');

  const refreshData = () => {
    getRecords().then(res => setFinaleExamRooms(res));
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between my-2">
        <h1 className="text-2xl font-bold">Peran Penguji</h1>
        <div className="flex space-x-2">
          <Button variant="default" onClick={() => navigate('/finale-examination/examiner-role/c')}>
            <Plus /> Tambah Manual
          </Button>
        </div>
      </div>
      <SimpleDataTable
        isLoading={isLoading}
        columns={TABLE_COL}
        data={finaleExamRooms}
        onEdit={data => navigate(`e/${data.id}`)}
        onDelete={async data => {
          try {
            if (!confirm(`Are you sure you want to delete this "${data.role}"?`)) return;
            await deleteRecord(data.id);
            const updatedRecords = await getRecords();
            setFinaleExamRooms(updatedRecords);
            toast.success('Student deleted successfully.');
          } catch (error) {
            toast.error('Failed to delete student.' + error);
          }
        }}
      />
    </div>
  );
}

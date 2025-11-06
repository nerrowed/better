import { SimpleDataTable } from '@/components/tables/simple-data-table';
import { useAuth } from '@/hooks/use-auth';
import { LECTURER_TABLE_COL, STUDENT_TABLE_COL } from './finale-examination-page.schema';
import { useFinaleExaminationData } from '@/hooks/use-finale-examination-data';

export default function FinaleExaminationPage() {
  const { user } = useAuth();
  const { getStudentSchedules, getExaminerSchedules, isLoading } = useFinaleExaminationData();

  if (!user) return;
  const examinerSchedules = getExaminerSchedules(user.id);
  const studentSchedules = getStudentSchedules(user.id);

  const TABLE_COL = user?.role === 'lecturer' ? LECTURER_TABLE_COL : STUDENT_TABLE_COL;
  const data = user?.role === 'lecturer' ? examinerSchedules : studentSchedules;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between my-2">
        <h1 className="text-2xl font-bold">Jadwal Sidang</h1>
      </div>
      <SimpleDataTable isLoading={isLoading} columns={TABLE_COL} data={data} />
    </div>
  );
}

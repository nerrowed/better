import { SimpleDataTable } from '@/components/tables/simple-data-table';
import usePocketbase from '@/hooks/use-pocketbase';
import { useEffect, useState } from 'react';
import type { LecturerStudentsViewRecord } from '@/types/pocketbase';
import { useAuth } from '@/hooks/use-auth';
import { LECTURER_TABLE_COL, STUDENT_TABLE_COL } from './mentoring-schedule-lecturer.columns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function MentoringScheduleLecturer() {
  const [mentoringSchedules, setLecturers] = useState<LecturerStudentsViewRecord[]>([]);
  const { getRecords, isLoading } = usePocketbase('lecturer_students_view');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const filter =
      user.role === 'lecturer' ? `lecturerId = "${user.id}"` : `studentId = "${user.id}"`;

    getRecords({ filter }).then(res => setLecturers(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TABLE_COL = user?.role === 'lecturer' ? LECTURER_TABLE_COL : STUDENT_TABLE_COL;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between my-2">
        <h1 className="text-2xl font-bold">Mentoring Schedule</h1>
        {isLoading === false && mentoringSchedules.length < 2 && user?.role === 'student' && (
          <Button onClick={() => navigate('/request-lecturer')}>Request Dosen Pembimbing</Button>
        )}
      </div>
      <SimpleDataTable isLoading={isLoading} columns={TABLE_COL} data={mentoringSchedules} />
    </div>
  );
}

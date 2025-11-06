// src/app/dashboard/plotting/mentoring-plotting-page.tsx
import ErrorCard from '@/components/cards/error-card';
import { MentoringTable } from '@/components/tables/mentoring-plotting-table';
import { useMentoringData } from '@/hooks/use-mentoring-data';

export default function MentoringPlottingPage() {
  const {
    isLoading,
    error,
    plottingData,
    availableStudents,
    handleAddStudent,
    handleRemoveStudent,
    limitStudentsPerLecturer,
  } = useMentoringData();

  if (error) return <ErrorCard />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center my-2">
        <h1 className="text-2xl font-bold">Plotting Dosen Pembimbing</h1>
      </div>

      <MentoringTable
        isLoading={isLoading}
        plottingData={plottingData}
        availableStudents={availableStudents}
        limitStudentsPerLecturer={limitStudentsPerLecturer}
        onAddStudent={handleAddStudent}
        onRemoveStudent={handleRemoveStudent}
      />
    </div>
  );
}

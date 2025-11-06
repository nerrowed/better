// src/app/dashboard/plotting/finale-examination-plotting-page.tsx (Full Code)

import ErrorCard from '@/components/cards/error-card';
import { ExaminationPlottingTable } from '@/components/tables/examination-plotting-table';
import { useFinaleExaminationData } from '@/hooks/use-finale-examination-data';

export default function FinaleExaminationPlottingPage() {
  const {
    finaleExamSchedules,
    lecturers,
    allStudents,
    rooms,
    roles,
    error,
    isLoading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    addExaminer,
    updateExaminer,
    removeExaminer,
  } = useFinaleExaminationData();

  if (error) return <ErrorCard />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center my-2">
        <h1 className="text-2xl font-bold">Plotting Jadwal Sidang</h1>
      </div>

      <ExaminationPlottingTable
        isLoading={isLoading}
        finaleExamSchedules={finaleExamSchedules}
        allStudents={allStudents}
        lecturers={lecturers}
        rooms={rooms}
        roles={roles}
        onCreateSchedule={createSchedule}
        onUpdateSchedule={updateSchedule}
        onDeleteSchedule={deleteSchedule}
        onAddExaminer={addExaminer}
        onUpdateExaminer={updateExaminer}
        onRemoveExaminer={removeExaminer}
      />
    </div>
  );
}

// src/components/tables/mentoring-plotting-table.tsx
import React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import {
  type LecturersResponse,
  type StudentsResponse,
  type RecordIdString,
  MentoringSchedulesRoleOptions,
  type MentoringSchedulesLimitPerLecturerRecord,
} from '@/types/pocketbase';
import { StudentSelector } from '../selector/StudentSelector'; // Pastikan path impor benar
import { Spinner } from '../ui/shadcn-io/spinner';

// Tipe data Mahasiswa dengan peran yang sudah di-assign
type StudentWithRole = StudentsResponse & {
  role: MentoringSchedulesRoleOptions;
};

// Tipe data Dosen untuk plotting (menyertakan peran mahasiswa)
type PlottingData = LecturersResponse & {
  mentoredStudents: StudentWithRole[];
};

// Tipe data Mahasiswa yang Tersedia (menyertakan peran apa yang masih dibutuhkan)
type AvailableStudentWithRoles = StudentsResponse & {
  availableRoles: MentoringSchedulesRoleOptions[];
};

interface MentoringTableProps {
  limitStudentsPerLecturer: MentoringSchedulesLimitPerLecturerRecord[];
  plottingData: PlottingData[];
  isLoading?: boolean;
  // Menggunakan tipe baru yang menyertakan availableRoles
  availableStudents: AvailableStudentWithRoles[];
  // Signature onAddStudent diperbarui untuk menyertakan role
  onAddStudent: (
    lecturerId: RecordIdString,
    studentId: RecordIdString,
    role: MentoringSchedulesRoleOptions
  ) => void;
  onRemoveStudent: (lecturerId: RecordIdString, studentId: RecordIdString) => void;
}

export function MentoringTable({
  limitStudentsPerLecturer,
  plottingData,
  availableStudents,
  onAddStudent,
  onRemoveStudent,
  isLoading,
}: MentoringTableProps) {
  const getRoleLabel = (role: MentoringSchedulesRoleOptions) => {
    return role === MentoringSchedulesRoleOptions.lecturer_1 ? 'P1' : 'P2';
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%] font-semibold bg-secondary">Nama Dosen</TableHead>
            <TableHead className="w-[65%] font-semibold bg-secondary">
              Nama Mahasiswa (Peran)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={2} className="py-20 relative">
                <Spinner className="absolute m-auto inset-0" />
              </TableCell>
            </TableRow>
          )}
          {plottingData.map(lecturerData => {
            const studentCount = lecturerData.mentoredStudents.length;
            const hasStudents = studentCount > 0;
            // Rowspan: (jumlah_mahasiswa + 1 baris untuk tombol 'Tambah')
            const rowSpanValue = studentCount + 1;

            return (
              <React.Fragment key={lecturerData.id}>
                {/* 1. Baris Mahasiswa yang Sudah Dibimbing */}
                {lecturerData.mentoredStudents
                  // Sort berdasarkan peran P1 kemudian P2 untuk tampilan yang rapi
                  .sort(a => (a.role === MentoringSchedulesRoleOptions.lecturer_1 ? -1 : 1))
                  .map((student, studentIndex) => (
                    <TableRow key={student.id + student.role}>
                      {/* Cell Nama Dosen dengan rowSpan, hanya di baris pertama mahasiswa */}
                      {studentIndex === 0 && (
                        <TableCell
                          rowSpan={rowSpanValue}
                          className="align-top font-medium border-r"
                        >
                          {lecturerData.name}
                        </TableCell>
                      )}

                      {/* Cell Nama Mahasiswa */}
                      <TableCell className="py-2">
                        <div className="flex items-center justify-between">
                          <span>
                            {student.name} ({student.nim}){/* Tampilkan label Peran (P1/P2) */}
                            <span
                              className={cn(
                                'ml-2 px-2 py-0.5 text-xs font-semibold rounded-full',
                                student.role === MentoringSchedulesRoleOptions.lecturer_1
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-teal-100 text-teal-800'
                              )}
                            >
                              {getRoleLabel(student.role)}
                            </span>
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto text-red-500 hover:text-red-700"
                            onClick={() =>
                              // Hapus berdasarkan lecturerId dan studentId
                              onRemoveStudent(lecturerData.id, student.id)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                {/* 2. Baris untuk StudentSelector '+ Tambah' */}
                <TableRow className={cn({ 'bg-secondary/70': hasStudents })}>
                  {/* Jika dosen belum punya mahasiswa, Nama Dosen akan muncul di baris ini */}
                  {!hasStudents && (
                    <TableCell rowSpan={rowSpanValue} className="align-top font-medium border-r">
                      {lecturerData.name}
                    </TableCell>
                  )}

                  <TableCell className={cn('py-0 px-0', { 'border-t': hasStudents })}>
                    <StudentSelector
                      limitStudentsPerLecturer={limitStudentsPerLecturer}
                      lecturer={lecturerData}
                      mentoredStudents={lecturerData.mentoredStudents}
                      availableStudents={availableStudents}
                      onAddStudent={onAddStudent}
                    />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
          {!isLoading && plottingData.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-sebg-secondary0 py-8">
                Tidak ada data dosen ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

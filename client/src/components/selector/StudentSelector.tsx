// src/components/selector/StudentSelector.tsx

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  type LecturersResponse,
  type StudentsResponse,
  type RecordIdString,
  MentoringSchedulesRoleOptions,
  type MentoringSchedulesLimitPerLecturerRecord,
} from '@/types/pocketbase';
import { toast } from 'sonner';

// Tipe data Mahasiswa yang Tersedia (dari hook)
type AvailableStudentWithRoles = StudentsResponse & {
  availableRoles: MentoringSchedulesRoleOptions[];
};

// Tipe data Mahasiswa dengan peran yang sudah di-assign (untuk dosen saat ini)
type StudentWithRole = StudentsResponse & {
  role: MentoringSchedulesRoleOptions;
};

interface StudentSelectorProps {
  limitStudentsPerLecturer: MentoringSchedulesLimitPerLecturerRecord[];
  lecturer: LecturersResponse;
  mentoredStudents: StudentWithRole[];
  availableStudents: AvailableStudentWithRoles[];
  onAddStudent: (
    lecturerId: RecordIdString,
    studentId: RecordIdString,
    role: MentoringSchedulesRoleOptions
  ) => void;
}

/**
 * Memfilter daftar mahasiswa yang tersedia untuk seorang dosen.
 * Mahasiswa harus:
 * 1. Belum dibimbing oleh dosen saat ini.
 * 2. Masih membutuhkan peran pembimbingan (P1 atau P2).
 */
export function StudentSelector({
  limitStudentsPerLecturer,
  lecturer,
  mentoredStudents,
  availableStudents,
  onAddStudent,
}: StudentSelectorProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<RecordIdString>('');
  // State untuk menyimpan peran yang dipilih (P1 atau P2)
  const [selectedRole, setSelectedRole] = useState<MentoringSchedulesRoleOptions | ''>('');

  // 1. Cek Batas Dosen
  const theLimit =
    limitStudentsPerLecturer.find(limit => limit.lecturer === lecturer.id)?.limit || 0;
  const isLecturerFull = mentoredStudents.length >= theLimit;

  // 2. Filter mahasiswa yang BELUM dibimbing oleh dosen ini
  // Kita hanya bisa menambahkan satu role per dosen per mahasiswa,
  // jadi kita filter mahasiswa yang ID-nya sudah ada di mentoredStudents.
  const studentIdsMentoredByCurrentLecturer = new Set(mentoredStudents.map(s => s.id));

  // Mahasiswa yang tersedia: belum dibimbing oleh dosen ini, dan masih butuh pembimbing (availableRoles.length > 0)
  const filteredAvailableStudents = availableStudents.filter(
    student => !studentIdsMentoredByCurrentLecturer.has(student.id)
  );

  // 3. Ambil data mahasiswa yang sedang dipilih
  const selectedStudentData = filteredAvailableStudents.find(s => s.id === selectedStudentId);
  const studentAvailableRoles = selectedStudentData?.availableRoles || [];

  // Reset peran jika mahasiswa yang dipilih berganti atau tidak lagi tersedia
  // Atau jika peran yang sudah dipilih tidak lagi valid untuk mahasiswa tersebut
  React.useEffect(() => {
    if (selectedStudentId && selectedStudentData) {
      // Jika peran yang sudah dipilih tidak tersedia untuk mahasiswa ini, pilih peran pertama yang tersedia
      if (!studentAvailableRoles.includes(selectedRole as MentoringSchedulesRoleOptions)) {
        setSelectedRole(studentAvailableRoles[0] || '');
      }
    } else {
      setSelectedRole(''); // Kosongkan peran jika tidak ada mahasiswa yang dipilih
    }
  }, [selectedStudentId, selectedStudentData, studentAvailableRoles, selectedRole]);

  const handleAdd = () => {
    if (isLecturerFull) {
      toast.warning('Batas Penuh', {
        description: `Dosen ${lecturer.name} sudah mencapai batas maksimal ${theLimit} mahasiswa.`,
      });
      return;
    }
    if (!selectedStudentId || !selectedRole) {
      toast.warning('Pilih Lengkap', {
        description: 'Mohon pilih Mahasiswa dan Peran (P1/P2) yang akan ditambahkan.',
      });
      return;
    }

    // Panggil handler dengan menyertakan peran
    onAddStudent(lecturer.id, selectedStudentId, selectedRole as MentoringSchedulesRoleOptions);
    setSelectedStudentId('');
    setSelectedRole('');
  };

  return (
    <div className="flex w-full items-center p-2 gap-2">
      {/* Selector Mahasiswa */}
      <Select
        onValueChange={setSelectedStudentId}
        value={selectedStudentId}
        disabled={isLecturerFull || filteredAvailableStudents.length === 0}
      >
        <SelectTrigger
          className={cn('w-full transition-colors', {
            'bg-red-50 hover:bg-red-100': isLecturerFull,
            'opacity-70': filteredAvailableStudents.length === 0,
          })}
        >
          <SelectValue
            placeholder={
              isLecturerFull
                ? `Kuota Penuh (${theLimit} Mhs)`
                : filteredAvailableStudents.length === 0
                ? 'Semua mahasiswa yang tersedia sudah dibimbing oleh dosen ini.'
                : 'Pilih Mahasiswa'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {filteredAvailableStudents.map(student => (
            <SelectItem key={student.id} value={student.id}>
              {student.name} ({student.nim})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selector Peran (P1/P2) */}
      <Select
        onValueChange={(value: string) => setSelectedRole(value as MentoringSchedulesRoleOptions)}
        value={selectedRole}
        disabled={isLecturerFull || !selectedStudentData || studentAvailableRoles.length === 0}
      >
        <SelectTrigger className="w-[150px] shrink-0">
          <SelectValue placeholder="Pilih Peran" />
        </SelectTrigger>
        <SelectContent>
          {studentAvailableRoles.map(role => (
            <SelectItem key={role} value={role}>
              {role === MentoringSchedulesRoleOptions.lecturer_1
                ? 'Pembimbing 1 (P1)'
                : 'Pembimbing 2 (P2)'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleAdd}
        disabled={isLecturerFull || !selectedStudentId || !selectedRole}
        className="shrink-0 transition-all duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tambah
      </Button>
    </div>
  );
}

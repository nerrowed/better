// hooks/use-mentoring-data.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import usePocketbase from "@/hooks/use-pocketbase";
import {
    Collections,
    type LecturersResponse,
    type StudentsResponse,
    type MentoringSchedulesResponse,
    type RecordIdString,
    MentoringSchedulesRoleOptions,
    type MentoringSchedulesLimitPerLecturerRecord,
} from "@/types/pocketbase";

// Konstanta Peran Dosen 
const ROLE_1: MentoringSchedulesRoleOptions = MentoringSchedulesRoleOptions.lecturer_1;
const ROLE_2: MentoringSchedulesRoleOptions = MentoringSchedulesRoleOptions.lecturer_2;

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

export function useMentoringData() {
    const lecturersHook = usePocketbase<"lecturers">(Collections.Lecturers);
    const studentsHook = usePocketbase<"students">(Collections.Students);
    const mentoringHook = usePocketbase<"mentoring_schedules">(
        Collections.MentoringSchedules
    );
    const limitHook = usePocketbase(Collections.MentoringSchedulesLimitPerLecturer);

    const [limitStudentsPerLecturer, setLimitStudentsPerLecturer] = useState<MentoringSchedulesLimitPerLecturerRecord[]>([]);
    const [lecturers, setLecturers] = useState<LecturersResponse[]>([]);
    const [allStudents, setAllStudents] = useState<StudentsResponse[]>([]);
    const [mentoringSchedules, setMentoringSchedules] = useState<
        MentoringSchedulesResponse[]
    >([]);

    const isLoading =
        lecturersHook.isLoading ||
        studentsHook.isLoading ||
        mentoringHook.isLoading;

    const error =
        lecturersHook.error || studentsHook.error || mentoringHook.error;

    // 1. Menggabungkan data Dosen, Jadwal Pembimbingan, dan Peran
    const plottingData = useMemo<PlottingData[]>(() => {
        if (!lecturers.length || !allStudents.length) return [];

        return lecturers.map((lecturer) => {
            // Filter jadwal pembimbingan yang sesuai dengan dosen
            const lecturerMentors = mentoringSchedules.filter(
                (m) => m.lecturer_id === lecturer.id
            );

            // Ambil data mahasiswa dan gabungkan dengan peran pembimbingannya
            const mentoredStudents: StudentWithRole[] = lecturerMentors
                .map((mentor) => {
                    const student = allStudents.find((s) => s.id === mentor.student_id);
                    if (student) {
                        return {
                            ...student,
                            role: mentor.role, // Ambil role dari schedule
                        };
                    }
                    return undefined;
                })
                .filter((s): s is StudentWithRole => s !== undefined);

            return {
                ...lecturer,
                mentoredStudents: mentoredStudents,
            };
        });
    }, [lecturers, allStudents, mentoringSchedules]);

    // 2. Mahasiswa yang masih tersedia (yang belum memiliki P1 dan/atau P2)
    const availableStudents = useMemo<AvailableStudentWithRoles[]>(() => {
        if (!allStudents.length) return [];

        // Map untuk melacak peran (P1/P2) yang sudah dimiliki setiap mahasiswa
        const studentRolesMap = new Map<RecordIdString, Set<MentoringSchedulesRoleOptions>>();

        // Isi map dengan peran yang sudah diambil
        mentoringSchedules.forEach((m) => {
            const roles = studentRolesMap.get(m.student_id) || new Set<MentoringSchedulesRoleOptions>();
            roles.add(m.role); // m.role harus ada karena sudah diwajibkan di tipe
            studentRolesMap.set(m.student_id, roles);
        });

        const studentsNeedingMentors: AvailableStudentWithRoles[] = [];

        // Filter mahasiswa: Cek peran apa yang masih dibutuhkan
        allStudents.forEach((student) => {
            const rolesTaken = studentRolesMap.get(student.id) || new Set<MentoringSchedulesRoleOptions>();
            const neededRoles: MentoringSchedulesRoleOptions[] = [];

            // Cek apakah mahasiswa sudah punya P1
            if (!rolesTaken.has(ROLE_1)) {
                neededRoles.push(ROLE_1);
            }
            // Cek apakah mahasiswa sudah punya P2
            if (!rolesTaken.has(ROLE_2)) {
                neededRoles.push(ROLE_2);
            }

            // Jika masih butuh peran, masukkan ke daftar tersedia
            if (neededRoles.length > 0) {
                studentsNeedingMentors.push({
                    ...student,
                    availableRoles: neededRoles,
                });
            }
        });

        return studentsNeedingMentors;
    }, [allStudents, mentoringSchedules]);

    const fetchData = useCallback(async () => {
        try {
            const [lects, stds, mentors, limits] = await Promise.all([
                lecturersHook.getRecords(),
                studentsHook.getRecords(),
                mentoringHook.getRecords(),
                limitHook.getRecords(),
            ]);

            setLecturers(lects);
            setAllStudents(stds);
            setMentoringSchedules(mentors);
            setLimitStudentsPerLecturer(limits);
        } catch (error) {
            toast.error("Gagal Memuat Data", {
                description:
                    "Terjadi kesalahan saat mengambil data dari server. " + error,
            });
        }
    }, []);


    // 3. Handler untuk menambah mahasiswa ke dosen (dengan peran/role)
    const handleAddStudent = useCallback(
        async (lecturerId: RecordIdString, studentId: RecordIdString, role: MentoringSchedulesRoleOptions) => {
            const studentName =
                allStudents.find((s) => s.id === studentId)?.name || "Mahasiswa";

            try {
                const payload = {
                    lecturer_id: lecturerId,
                    student_id: studentId,
                    role: role, // Kirim peran/role ke database
                    is_requested: false,
                    schedule_start: new Date().toISOString(),
                    schedule_end: new Date().toISOString(),
                };

                const newMentor = await mentoringHook.createRecord(payload);

                setMentoringSchedules((prev) => [
                    ...prev,
                    newMentor as MentoringSchedulesResponse,
                ]);

                toast.success("Berhasil", {
                    description: `${studentName} berhasil ditambahkan sebagai ${role === MentoringSchedulesRoleOptions.lecturer_1 ? 'Pembimbing 1' : 'Pembimbing 2'}.`,
                });
            } catch (error) {
                toast.error("Gagal Menambahkan", {
                    description:
                        "Gagal menambahkan mahasiswa sebagai pembimbing. Cek koneksi server. " +
                        error,
                });
            }
        },
        [allStudents]
    );

    // 4. Handler untuk menghapus mahasiswa dari dosen
    // Pencarian mentor record harus menggunakan lecturerId dan studentId saja, karena satu mahasiswa bisa dibimbing oleh dosen yang sama (tapi dengan 2 record berbeda jika ada dua peran, namun dalam konteks ini, kita asumsikan 1 dosen = 1 record per mahasiswa).
    // Karena kita tidak bisa yakin apakah dosen yang sama membimbing 2 peran, kita harus menghapus record berdasarkan *kedua* ID (dosen dan mahasiswa)
    const handleRemoveStudent = useCallback(
        async (lecturerId: RecordIdString, studentId: RecordIdString) => {
            // Find ALL mentor records for this lecturer-student pair (should only be one, but safety first)
            const mentorRecordsToDelete = mentoringSchedules.filter(
                (m) => m.lecturer_id === lecturerId && m.student_id === studentId
            );
            const studentName =
                allStudents.find((s) => s.id === studentId)?.name || "Mahasiswa";

            if (mentorRecordsToDelete.length === 0) return;

            try {
                // Assuming only one mentor record exists per lecturer-student pair
                // If a lecturer can be P1 and P2 for the same student (unlikely), 
                // this logic needs refinement, but for now we delete the first found.
                const mentorRecord = mentorRecordsToDelete[0];

                await mentoringHook.deleteRecord(mentorRecord.id);

                setMentoringSchedules((prev) =>
                    prev.filter((m) => m.id !== mentorRecord.id)
                );

                toast.info("Berhasil Dihapus", {
                    description: `Pembimbingan (${mentorRecord.role === MentoringSchedulesRoleOptions.lecturer_1 ? 'P1' : 'P2'}) untuk ${studentName} berhasil dihapus dari ${lecturers.find(l => l.id === lecturerId)?.name || 'dosen'}.`,
                });
            } catch (error) {
                toast.error("Gagal Menghapus", {
                    description:
                        "Gagal menghapus pembimbingan. Cek koneksi server. " + error,
                });
            }
        },
        [allStudents, mentoringSchedules, lecturers]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        isLoading,
        error,
        plottingData,
        availableStudents,
        limitStudentsPerLecturer,
        handleAddStudent,
        handleRemoveStudent,
    };
}

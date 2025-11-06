import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import usePocketbase from "@/hooks/use-pocketbase";
import {
    Collections,
    type LecturersResponse,
    type StudentsResponse, // PENTING: Gunakan tipe ini untuk data student lengkap
    type RecordIdString,
    type FinaleExamRoomsResponse,
    type FinaleExamExaminerRoleResponse,
    type FinaleExamScheduleWithExaminersViewResponse,
    type StudentsRecord, // Menggunakan tipe dari pocketbase-typegen
} from "@/types/pocketbase";

// ====================================================================
// SIMULASI TIPE DARI POCKETBASE-TYPEGEN UNTUK VIEW BARU
// ====================================================================

// Tipe untuk setiap examiner yang sudah digabungkan (hasil dari json_object)
export type ScheduleExaminerData = {
    examiner_id: RecordIdString;
    lecturer_id: RecordIdString;
    lecturer_name: string;
    lecturer_nip: string;
    role_id: RecordIdString;
    role_name: string;
}

// Tipe BARU untuk data student yang lengkap
// Menggunakan properti yang dibutuhkan dari StudentsResponse
export type ScheduleStudentData = StudentsRecord

// Tipe Response untuk View baru (sesuai output SQL yang diperbaiki)
// CATATAN: Karena kita menggunakan expand untuk student,
// kita harus membuat ulang tipe response yang mengakomodasi 'expand'
interface FinaleExamScheduleWithExaminersRaw extends Omit<FinaleExamScheduleWithExaminersViewResponse, 'examiners_data'> {
    examiners_data: string; // Tetap string (json)
    // Overwrite atau tambahkan properti expand secara manual untuk student_ids
    expand?: {
        student_ids?: StudentsResponse[]; // PocketBase akan meletakkan data lengkap student di sini
    };
}
interface FinaleExamScheduleWithExaminersResponse extends FinaleExamScheduleWithExaminersRaw {
    id: RecordIdString;
}

// Definisikan tipe untuk data jadwal yang sudah 'bersih' dan siap pakai
export type MergedFinaleExamSchedule = Omit<FinaleExamScheduleWithExaminersResponse, 'examiners_data' | 'expand'> & {
    room_id: RecordIdString | null;
    room_name: string | null;
    examiners: ScheduleExaminerData[];
    students: ScheduleStudentData[]; // Properti BARU untuk data student lengkap
};

// ====================================================================
// PAYLOADS
// ====================================================================

// Payload untuk pembuatan/pembaruan jadwal di tabel asli
export type FinaleSchedulePayload = {
    date: string;
    end_time: string;
    room?: RecordIdString;
    start_time: string;
    student_ids: RecordIdString[];
};

// Payload untuk pembuatan examiner baru
export type ExaminerPayload = {
    id_lecturer: RecordIdString;
    id_schedule: RecordIdString; // ID jadwal tempat examiner ini ditambahkan
    role: RecordIdString; // ID role examiner
};

// Payload untuk update examiner
export type UpdateExaminerPayload = Partial<Omit<ExaminerPayload, 'id_schedule'>>;

// ====================================================================
// NEW UTILITY FUNCTIONS FOR VIEWING SCHEDULES
// ====================================================================

/**
 * Filter jadwal ujian untuk mahasiswa tertentu.
 * @param schedules Daftar lengkap MergedFinaleExamSchedule.
 * @param studentId ID mahasiswa yang dicari.
 * @returns Array MergedFinaleExamSchedule yang relevan.
 */
export const getStudentSchedules = (
    schedules: MergedFinaleExamSchedule[],
    studentId: RecordIdString
): MergedFinaleExamSchedule[] => {
    if (!studentId) return [];
    // Pengecekan sekarang menggunakan properti students yang sudah 'bersih'
    return schedules.filter(schedule => schedule.students.some(student => student.id === studentId));
};

/**
 * Filter jadwal ujian untuk dosen/penguji tertentu.
 * @param schedules Daftar lengkap MergedFinaleExamSchedule.
 * @param lecturerId ID dosen/penguji yang dicari.
 * @returns Array MergedFinaleExamSchedule yang relevan.
 */
export const getExaminerSchedules = (
    schedules: MergedFinaleExamSchedule[],
    lecturerId: RecordIdString
): MergedFinaleExamSchedule[] => {
    if (!lecturerId) return [];
    return schedules.filter(schedule =>
        schedule.examiners.some(examiner => examiner.lecturer_id === lecturerId)
    );
};

// ====================================================================
// HOOK UTAMA
// ====================================================================

export function useFinaleExaminationData() {
    // --- 1. Hooks Utama ---
    const lecturersHook = usePocketbase(Collections.Lecturers);
    const studentsHook = usePocketbase(Collections.Students);
    const roomsHook = usePocketbase(Collections.FinaleExamRooms);
    const rolesHook = usePocketbase(Collections.FinaleExamExaminerRole);

    // Hook untuk READ data gabungan dari View
    const finaleScheduleViewHook = usePocketbase('finale_exam_schedule_with_examiners_view');
    // Hook untuk WRITE data ke tabel jadwal ASLI
    const finaleSchedulesHook = usePocketbase(Collections.FinaleExamSchedules);
    // Hook untuk WRITE data ke tabel examiner ASLI (relasi)
    const examinersHook = usePocketbase(Collections.FinaleExamExaminer);

    // --- 2. States ---
    const [lecturers, setLecturers] = useState<LecturersResponse[]>([]);
    const [allStudents, setAllStudents] = useState<StudentsResponse[]>([]);
    const [rooms, setRooms] = useState<FinaleExamRoomsResponse[]>([]);
    const [roles, setRoles] = useState<FinaleExamExaminerRoleResponse[]>([]);
    const [finaleExamSchedules, setFinaleExamSchedules] = useState<MergedFinaleExamSchedule[]>([]);

    const isLoading =
        lecturersHook.isLoading ||
        studentsHook.isLoading ||
        finaleScheduleViewHook.isLoading ||
        roomsHook.isLoading ||
        rolesHook.isLoading;

    const error =
        lecturersHook.error ||
        studentsHook.error ||
        finaleScheduleViewHook.error ||
        roomsHook.error ||
        rolesHook.error;

    // --- 3. Data Processing ---
    const processScheduleData = useCallback((data: FinaleExamScheduleWithExaminersResponse[]): MergedFinaleExamSchedule[] => {
        return data.map(schedule => {
            let examiners: ScheduleExaminerData[] = [];
            let students: ScheduleStudentData[] = [];

            // 1. Proses Examiner
            // NOTE: Meskipun examiners_data adalah string JSON di tipe mentah,
            // PocketBase SDK dapat mengkonversi kolom JSON/View menjadi Array di hasil akhir
            if (schedule.examiners_data && Array.isArray(schedule.examiners_data)) {
                // Konversi string JSON yang dibaca dari View menjadi array
                examiners = schedule.examiners_data as ScheduleExaminerData[];
            }

            // 2. Proses Student (dari expand)
            const rawStudents = schedule.expand?.student_ids;

            if (rawStudents && Array.isArray(rawStudents)) {
                students = rawStudents
            } else if (schedule.student_ids) {
                // Fallback/Safety Check: Jika expand gagal/tidak ada, data student akan kosong
                // atau hanya berisi ID jika kita tidak ingin error
                // Namun, untuk MergedFinaleExamSchedule yang bersih, kita asumsikan expand sukses
            }


            return {
                ...schedule,
                examiners,
                students, // Data student yang sudah bersih
                room_id: schedule.room_id || null,
                room_name: schedule.room_name || null,
            } as MergedFinaleExamSchedule;
        });
    }, []);

    // --- 4. Fetch Data (READ) ---
    const fetchData = useCallback(async () => {
        try {
            const [lects, stds, rms, rls, schedulesRaw] = await Promise.all([
                lecturersHook.getRecords({ sort: 'name', $autoCancel: false }),
                studentsHook.getRecords({ sort: 'name', $autoCancel: false }),
                roomsHook.getRecords({ sort: 'room_name', $autoCancel: false }),
                rolesHook.getRecords({ sort: 'role', $autoCancel: false }),
                // PENTING: Menambahkan expand student_ids di sini
                finaleScheduleViewHook.getRecords({ expand: 'student_ids', $autoCancel: false }),
            ]);

            const schedulesMerged = processScheduleData(schedulesRaw as FinaleExamScheduleWithExaminersResponse[]);

            setLecturers(lects);
            setAllStudents(stds);
            setRooms(rms);
            setRoles(rls);
            setFinaleExamSchedules(schedulesMerged);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            toast.error("Failed to Load Data", {
                description: `An error occurred while fetching data from the server: ${errorMessage}`,
            });
            throw err;
        }
    }, [processScheduleData]);

    const refetchData = useCallback(() => {
        return fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // ---------------------------------------------
    // CRUD: Jadwal (Tabel Asli: finale_exam_schedules)
    // ---------------------------------------------

    // Mengembalikan ID jadwal yang baru dibuat untuk digunakan examiner
    const createSchedule = useCallback(async (data: FinaleSchedulePayload): Promise<RecordIdString> => {
        try {
            const newSchedule = await finaleSchedulesHook.createRecord(data);
            await refetchData();
            toast.success("Schedule Created Successfully");
            return newSchedule.id;
        } catch (err) {
            const error = err instanceof Error ? err.message : "An unknown error occurred";
            toast.error("Failed to Create Schedule", { description: `Error: ${error}` });
            throw err;
        }
    }, [refetchData]);

    const updateSchedule = useCallback(async (id: RecordIdString, data: Partial<FinaleSchedulePayload>): Promise<void> => {
        try {
            await finaleSchedulesHook.updateRecord(id, data);
            // await refetchData(); // Dihilangkan agar tidak mengganggu autosave cepat
        } catch (err) {
            const error = err instanceof Error ? err.message : "An unknown error occurred";
            toast.error("Failed to Update Schedule", { description: `Error: ${error}` });
            throw err;
        }
    }, []);

    const deleteSchedule = useCallback(async (id: RecordIdString): Promise<boolean> => {
        try {
            const scheduleToDelete = finaleExamSchedules.find(schedule => schedule.id === id);

            if (scheduleToDelete?.examiners) {
                const removalPromises = scheduleToDelete.examiners.map(examiner =>
                    examinersHook.deleteRecord(examiner.examiner_id, { $autoCancel: false })
                );
                await Promise.all(removalPromises);
            }

            const success = await finaleSchedulesHook.deleteRecord(id);
            if (success) {
                await refetchData();
                toast.success("Schedule Deleted Successfully");
            } else {
                throw new Error("Deletion failed on the server side or record not found.");
            }

            return success;

        } catch (err) {
            const error = err instanceof Error ? err.message : "An unknown error occurred";
            toast.error("Failed to Delete Schedule", { description: `Error: ${error}` });
            throw err;
        }
    }, [finaleExamSchedules, refetchData]); // Tambahkan dependensi yang hilang


    // ---------------------------------------------
    // CRUD: Examiner (Tabel Asli: finale_exam_examiner)
    // ---------------------------------------------

    const addExaminer = useCallback(async (data: ExaminerPayload): Promise<void> => {
        try {
            await examinersHook.createRecord(data, { $autoCancel: false });
            await refetchData();
            // toast.success("Examiner Added Successfully");
        } catch (err) {
            const error = err instanceof Error ? err.message : "An unknown error occurred";
            toast.error("Failed to Add Examiner", { description: `Error: ${error}` });
            throw err;
        }
    }, [refetchData]);

    const updateExaminer = useCallback(async (id: RecordIdString, data: UpdateExaminerPayload): Promise<void> => {
        try {
            await examinersHook.updateRecord(id, data, { $autoCancel: false });
            await refetchData();
        } catch (err) {
            const error = err instanceof Error ? err.message : "An unknown error occurred";
            toast.error("Failed to Update Examiner", { description: `Error: ${error}` });
            throw err;
        }
    }, [refetchData]);


    const removeExaminer = useCallback(async (examinerId: RecordIdString): Promise<void> => {
        try {
            await examinersHook.deleteRecord(examinerId, { $autoCancel: false });
            await refetchData();
            // toast.success("Examiner Removed Successfully");
        } catch (err) {
            const error = err instanceof Error ? err.message : "An unknown error occurred";
            toast.error("Failed to Remove Examiner", { description: `Error: ${error}` });
            throw err;
        }
    }, [refetchData]);


    return {
        isLoading,
        error,
        lecturers,
        allStudents,
        rooms,
        roles,
        finaleExamSchedules,

        // Schedule CRUD
        createSchedule,
        updateSchedule,
        deleteSchedule,

        // Examiner CRUD
        addExaminer,
        updateExaminer,
        removeExaminer,

        // NEW VIEWER METHODS
        getStudentSchedules: useCallback((studentId: RecordIdString) => getStudentSchedules(finaleExamSchedules, studentId), [finaleExamSchedules]),
        getExaminerSchedules: useCallback((lecturerId: RecordIdString) => getExaminerSchedules(finaleExamSchedules, lecturerId), [finaleExamSchedules]),

        refetchData,
    };
}
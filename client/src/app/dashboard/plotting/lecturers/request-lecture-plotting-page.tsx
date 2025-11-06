import usePocketbase from "@/hooks/use-pocketbase";
import {
  type LecturersResponse,
  type MentoringSchedulesRecord,
  type RecordIdString,
  type MentoringSchedulesResponse,
  // Menggunakan tipe enum terbaru dari PocketBase
  MentoringSchedulesRoleOptions,
} from "@/types/pocketbase";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// --- UI Component Imports (using standard ShadCN structure) ---
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Constants (Menggunakan tipe enum MentoringSchedulesRoleOptions)
const ROLE_P1: MentoringSchedulesRoleOptions =
  MentoringSchedulesRoleOptions.lecturer_1;
const ROLE_P2: MentoringSchedulesRoleOptions =
  MentoringSchedulesRoleOptions.lecturer_2;

export default function RequestLecturerPlottingPage() {
  const { user } = useAuth();
  const { showAlertDialog } = useAlertDialog();
  const navigate = useNavigate();

  const [allLecturers, setAllLecturers] = useState<LecturersResponse[]>([]);
  const [currentSchedules, setCurrentSchedules] = useState<
    MentoringSchedulesResponse[]
  >([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State: Menyimpan ID Dosen yang dipilih untuk P1 dan P2
  const [selectedP1Id, setSelectedP1Id] = useState<RecordIdString | "">("");
  const [selectedP2Id, setSelectedP2Id] = useState<RecordIdString | "">("");

  const lecturersHook = usePocketbase<"lecturers">("lecturers");
  const mentoringHook = usePocketbase<"mentoring_schedules">(
    "mentoring_schedules"
  );

  const studentId = user?.id as RecordIdString | undefined;

  // --- Data Fetching Logic ---
  const fetchData = useCallback(async () => {
    if (!studentId) return;

    setIsLoadingData(true);
    setError(null);
    try {
      const [lecturersData, schedulesData] = await Promise.all([
        lecturersHook.getRecords(),
        // Ambil jadwal mentoring student saat ini, expand lecturer_id untuk mendapatkan nama dosen
        mentoringHook.getRecords({
          filter: `student_id = '${studentId}'`,
          expand: "lecturer_id",
        }),
      ]);

      setAllLecturers(lecturersData);
      setCurrentSchedules(schedulesData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Gagal memuat data dosen dan jadwal. Silakan coba lagi.");
      toast.error("Gagal Memuat Data", {
        description: "Terjadi kesalahan saat mengambil data.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Derived State (Current Status & Available Options) ---

  // Cek apakah P1 dan P2 sudah ada (sudah diajukan atau dikonfirmasi)
  const currentP1Schedule = useMemo(
    () => currentSchedules.find((s) => s.role === ROLE_P1),
    [currentSchedules]
  );

  const currentP2Schedule = useMemo(
    () => currentSchedules.find((s) => s.role === ROLE_P2),
    [currentSchedules]
  );

  // Utility untuk mendapatkan nama dosen dari data yang di-expand
  const getLecturerName = (
    schedule: MentoringSchedulesResponse | undefined
  ) => {
    if (!schedule) return "N/A";

    // FIX: Mengatasi error 'Property 'lecturer_id' does not exist on type '{}''
    // Menggunakan index signature access untuk PocketBase expand data
    const expandedLecturer = (
      schedule.expand as Record<string, LecturersResponse> | undefined
    )?.lecturer_id;
    return expandedLecturer ? expandedLecturer.name : "Dosen Tidak Dikenal";
  };

  // Dosen yang tersedia untuk dipilih (belum pernah diajukan sebelumnya)
  const availableLecturersOptions = useMemo(() => {
    // ID dosen yang sudah ada di jadwal student saat ini
    const requestedIds = new Set(currentSchedules.map((s) => s.lecturer_id));

    // Filter semua dosen dengan ID yang belum diajukan
    return allLecturers.filter((l) => !requestedIds.has(l.id));
  }, [allLecturers, currentSchedules]);

  // Opsi P2: semua dosen tersedia dikurangi P1 yang sedang dipilih
  const p2Options = useMemo(() => {
    return availableLecturersOptions.filter((l) => l.id !== selectedP1Id);
  }, [availableLecturersOptions, selectedP1Id]);

  // Opsi P1: semua dosen tersedia dikurangi P2 yang sedang dipilih
  const p1Options = useMemo(() => {
    return availableLecturersOptions.filter((l) => l.id !== selectedP2Id);
  }, [availableLecturersOptions, selectedP2Id]);

  // --- Submission Handler ---

  // FIX: Menggunakan MentoringSchedulesRoleOptions untuk tipe role
  const handleCreateRequest = async (
    lecturerId: RecordIdString,
    role: MentoringSchedulesRoleOptions
  ) => {
    if (!studentId) return;

    try {
      const payload: Omit<MentoringSchedulesRecord, "id"> = {
        lecturer_id: lecturerId,
        student_id: studentId,
        role: role, // Tentukan peran (P1/P2)
        is_requested: true, // Tandai sebagai permintaan dari mahasiswa
        schedule_start: new Date().toISOString(),
        schedule_end: new Date().toISOString(),
      };

      await mentoringHook.createRecord(payload);
      return true;
    } catch (error) {
      console.error(`Failed to request ${role}:`, error);
      toast.error(`Gagal Request ${role === ROLE_P1 ? "P1" : "P2"}`, {
        description: "Terjadi kesalahan saat menyimpan data. " + error,
      });
      return false;
    }
  };

  const handleSubmit = (
    p1Id: RecordIdString | "",
    p2Id: RecordIdString | ""
  ) => {
    const p1Name = p1Id
      ? allLecturers.find((l) => l.id === p1Id)?.name
      : "Tidak Ada";
    const p2Name = p2Id
      ? allLecturers.find((l) => l.id === p2Id)?.name
      : "Tidak Ada";

    showAlertDialog({
      title: "Konfirmasi Pengajuan Dosen",
      description: `Anda akan mengajukan pengajuan untuk Dosen Pembimbing 1: ${p1Name} dan Dosen Pembimbing 2: ${p2Name}. Pengajuan tidak dapat diulangi. Lanjutkan?`,
      onContinue: async () => {
        if (!p1Id && !p2Id) {
          toast.warning("Peringatan", {
            description: "Pilih minimal satu dosen untuk diajukan.",
          });
          return;
        }

        setIsSubmitting(true);
        let successP1: boolean | undefined = true;
        let successP2: boolean | undefined = true;

        // Hanya buat record jika pilihan dibuat DAN slot Dosen tersebut saat ini masih kosong di DB
        if (p1Id && !currentP1Schedule) {
          successP1 = await handleCreateRequest(p1Id, ROLE_P1);
        }

        if (p2Id && !currentP2Schedule) {
          successP2 = await handleCreateRequest(p2Id, ROLE_P2);
        }

        setIsSubmitting(false);

        if (successP1 && successP2) {
          toast.success("Permintaan Berhasil", {
            description:
              "Permintaan Dosen Pembimbing berhasil diajukan. Menunggu konfirmasi admin.",
          });
          navigate("/mentoring-schedule");
        } else {
          fetchData();
        }
      },
    });
  };

  const isP1Locked = !!currentP1Schedule;
  const isP2Locked = !!currentSchedules.find((s) => s.role === ROLE_P2);
  const isFormLocked = isP1Locked && isP2Locked;

  const handleSubmitWrapper = () => {
    handleSubmit(selectedP1Id, selectedP2Id);
  };

  if (error) {
    return (
      <div className="p-6 text-red-600 border border-red-200 bg-red-50 rounded-lg mx-6 mt-6">
        <h2 className="font-bold">⚠️ Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pengajuan Dosen Pembimbing</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Formulir Pengajuan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingData ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dosen Pembimbing 1 (P1) Selection */}
              <div>
                <Label className="text-base font-semibold block mb-2">
                  Dosen Pembimbing 1 (P1)
                </Label>
                {isP1Locked ? (
                  <div className="p-3 border rounded-md bg-secondary-50 text-secondary-800 font-medium flex items-center">
                    <CheckCheck className="h-5 w-5 mr-2" />
                    {getLecturerName(currentP1Schedule)}
                  </div>
                ) : (
                  <Select
                    onValueChange={setSelectedP1Id}
                    value={selectedP1Id}
                    disabled={isFormLocked || p1Options.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Dosen Pembimbing 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {p1Options.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          {lecturer.name} ({lecturer.nip})
                        </SelectItem>
                      ))}
                      {p1Options.length === 0 && (
                        <div className="p-2 text-sm text-center text-muted-foreground">
                          Tidak ada dosen tersedia.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Dosen Pembimbing 2 (P2) Selection */}
              <div>
                <Label className="text-base font-semibold block mb-2">
                  Dosen Pembimbing 2 (P2)
                </Label>
                {isP2Locked ? (
                  <div className="p-3 border rounded-md bg-secondary-50 text-secondary-800 font-medium flex items-center">
                    <CheckCheck className="h-5 w-5 mr-2" />
                    {getLecturerName(currentP2Schedule)}
                  </div>
                ) : (
                  <Select
                    onValueChange={setSelectedP2Id}
                    value={selectedP2Id}
                    disabled={isFormLocked || p2Options.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Dosen Pembimbing 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {p2Options.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          {lecturer.name} ({lecturer.nip})
                        </SelectItem>
                      ))}
                      {p2Options.length === 0 && (
                        <div className="p-2 text-sm text-center text-muted-foreground">
                          Tidak ada dosen tersedia.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Submission Button */}
          {!isFormLocked && !isLoadingData && (
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitWrapper}
                disabled={isSubmitting || (!selectedP1Id && !selectedP2Id)}
                className="w-full md:w-auto"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Ajukan Permintaan
              </Button>
            </div>
          )}

          {isFormLocked && (
            <div className="p-4 bg-secondary border border-secondary-200 text-secondary-800 rounded-lg text-center font-medium">
              <CheckCheck className="h-5 w-5 inline mr-2" />
              Anda sudah memiliki Pembimbing 1 dan Pembimbing 2 yang diajukan.
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 mt-4">
        * Permintaan Dosen Pembimbing yang diajukan akan masuk ke antrian dan
        menunggu persetujuan dari Admin.
      </p>
    </div>
  );
}

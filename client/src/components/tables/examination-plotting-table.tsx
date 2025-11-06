// src/components/tables/examination-plotting-table.tsx (Full Code dengan Perbaikan Searchable Select & No Debounce)

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
  type StudentsResponse,
  type LecturersResponse,
  type FinaleExamRoomsResponse,
  type FinaleExamExaminerRoleResponse,
  type RecordIdString,
} from '@/types/pocketbase';
import type {
  MergedFinaleExamSchedule,
  FinaleSchedulePayload,
  ExaminerPayload,
  UpdateExaminerPayload,
  ScheduleExaminerData,
} from '@/hooks/use-finale-examination-data';
import { Plus, Trash, CalendarIcon, Loader2, Save, X, Check, ChevronsUpDown } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { toast } from 'sonner';

// Menghapus import useDebounce karena tidak digunakan lagi
// import { useDebounce } from '@/lib/utils';

// --- UTILITY/HELPER COMPONENTS: Searchable Select (Combobox) ---

interface ItemOption {
  id: RecordIdString;
  label: string;
  value: string;
}

// Komponen Combobox/Searchable Select
const SearchableSelect = ({
  options,
  placeholder,
  onSelect,
  value,
  triggerClassName,
  disabled = false,
}: {
  options: ItemOption[];
  placeholder: string;
  onSelect: (id: RecordIdString) => void;
  value: RecordIdString; // ID item yang terpilih saat ini (biasanya kosong untuk Add)
  triggerClassName?: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  // Menampilkan label untuk value yang terpilih
  const selectedLabel = useMemo(() => options.find(o => o.id === value)?.label, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={`w-full justify-between h-9 ${triggerClassName}`}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[100]">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>Tidak ditemukan hasil.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map(option => (
              <CommandItem
                key={option.id}
                value={option.label} // Value untuk Command Input search
                onSelect={() => {
                  onSelect(option.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${value === option.id ? 'opacity-100' : 'opacity-0'}`}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// --- UTILITY/HELPER COMPONENTS: Examiner Input & Display ---

const ExaminerInput = ({
  lecturers,
  roles,
  onAdd,
  currentExaminers,
}: {
  lecturers: LecturersResponse[];
  roles: FinaleExamExaminerRoleResponse[];
  onAdd: (lecturerId: RecordIdString, roleId: RecordIdString) => void;
  currentExaminers: RecordIdString[];
}) => {
  const [lecturerId, setLecturerId] = useState<RecordIdString>('');
  const [roleId, setRoleId] = useState<RecordIdString>('');

  const handleAdd = () => {
    if (lecturerId && roleId) {
      onAdd(lecturerId, roleId);
      setLecturerId('');
      setRoleId('');
    }
  };

  // Format data Dosen untuk SearchableSelect
  const lecturerOptions = useMemo(
    () =>
      lecturers
        .filter(l => !currentExaminers.includes(l.id)) // Filter Dosen yang sudah menjadi Examiner
        .map(l => ({ id: l.id, label: l.name, value: l.name.toLowerCase() })),
    [lecturers, currentExaminers]
  );

  return (
    <div className="flex gap-1">
      {/* Gunakan SearchableSelect untuk Dosen */}
      <div className="flex-grow">
        <SearchableSelect
          options={lecturerOptions}
          placeholder="Select Lecturer..."
          onSelect={setLecturerId}
          value={lecturerId}
          disabled={lecturerOptions.length === 0}
        />
      </div>

      {/* Role tetap menggunakan Select biasa */}
      <Select onValueChange={setRoleId} value={roleId}>
        <SelectTrigger className="h-9 w-[80px] shrink-0">
          <SelectValue placeholder="Role..." />
        </SelectTrigger>
        <SelectContent>
          {roles.map(r => (
            <SelectItem key={r.id} value={r.id}>
              {r.role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleAdd}
        disabled={!lecturerId || !roleId}
        size="icon"
        className="h-9 w-9 shrink-0"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

const ExaminerDisplay = ({
  examiner,
  roles,
  onUpdateRole,
  onRemove,
}: {
  examiner: ScheduleExaminerData;
  roles: FinaleExamExaminerRoleResponse[];
  onUpdateRole: (examinerId: RecordIdString, newRoleId: RecordIdString) => Promise<void>;
  onRemove: (examinerId: RecordIdString) => Promise<void>;
}) => {
  const handleRoleChange = (newRoleId: string) => {
    if (newRoleId !== examiner.role_id) {
      onUpdateRole(examiner.examiner_id, newRoleId);
    }
  };

  return (
    <Button
      variant={'outline'}
      className="flex items-center justify-between gap-1 rounded-md w-full px-1 py-0.5 text-xs h-auto"
    >
      <span className="font-medium truncate">{examiner.lecturer_name}</span>

      <div className="flex items-center shrink-0">
        <Select onValueChange={handleRoleChange} value={examiner.role_id}>
          <SelectTrigger className="border-0 h-6 text-xs px-1 w-[100px]">
            <SelectValue>{examiner.role_name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {roles.map(r => (
              <SelectItem key={r.id} value={r.id}>
                {r.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={'ghost'}
          type="button"
          size={'icon'}
          onClick={() => onRemove(examiner.examiner_id)}
          className="ml-1 text-red-500 hover:text-red-700 h-6 w-6"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Button>
  );
};

// --- END UTILITY/HELPER COMPONENTS ---

interface ExaminationTableProps {
  finaleExamSchedules: MergedFinaleExamSchedule[];
  allStudents: StudentsResponse[];
  lecturers: LecturersResponse[];
  rooms: FinaleExamRoomsResponse[];
  roles: FinaleExamExaminerRoleResponse[];
  isLoading?: boolean;

  onCreateSchedule: (data: FinaleSchedulePayload) => Promise<RecordIdString>;
  onUpdateSchedule: (
    scheduleId: RecordIdString,
    data: Partial<FinaleSchedulePayload>
  ) => Promise<void>;
  onDeleteSchedule: (scheduleId: RecordIdString) => Promise<boolean>;
  onAddExaminer: (data: ExaminerPayload) => Promise<void>;
  onUpdateExaminer: (examinerId: RecordIdString, data: UpdateExaminerPayload) => Promise<void>;
  onRemoveExaminer: (examinerId: RecordIdString) => Promise<void>;
}

// =================================================================
// 3. KOMPONEN BARIS TAMBAH (AddRow)
// =================================================================

const initialAddFormState: FinaleSchedulePayload & { temp_examiners: ExaminerPayload[] } = {
  date: format(new Date(), 'yyyy-MM-dd'),
  start_time: '08:00',
  end_time: '10:00',
  room: undefined,
  student_ids: [],
  temp_examiners: [],
};

function AddRow({
  allStudents,
  lecturers,
  rooms,
  roles,
  onCreateSchedule,
  onAddExaminer,
  allScheduledStudentIds, // FIX: Props baru untuk semua student ID yang sudah terjadwal
}: Pick<
  ExaminationTableProps,
  'allStudents' | 'lecturers' | 'rooms' | 'roles' | 'onCreateSchedule' | 'onAddExaminer'
> & { allScheduledStudentIds: RecordIdString[] }) {
  const [formData, setFormData] = useState(initialAddFormState);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const schedulePayload: FinaleSchedulePayload = {
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room,
        student_ids: formData.student_ids,
      };
      const newScheduleId = await onCreateSchedule(schedulePayload);
      await Promise.all(
        formData.temp_examiners.map(e => onAddExaminer({ ...e, id_schedule: newScheduleId }))
      );
      setFormData(initialAddFormState); // Reset form
      toast.success('Schedule added and saved!');
    } catch (error) {
      toast.error('Schedule failed to save! ' + error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddExaminerLocal = (lecturerId: RecordIdString, roleId: RecordIdString) => {
    const isDuplicate = formData.temp_examiners.some(e => e.id_lecturer === lecturerId);
    if (isDuplicate) {
      toast.warning('Lecturer already added as examiner.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      temp_examiners: [
        ...prev.temp_examiners,
        { id_lecturer: lecturerId, role: roleId, id_schedule: '' },
      ],
    }));
  };

  const handleRemoveExaminerLocal = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      temp_examiners: prev.temp_examiners.filter((_, index) => index !== indexToRemove),
    }));
  };

  const isFormValid =
    formData.date && formData.start_time && formData.end_time && formData.student_ids.length > 0;

  // Format data Mahasiswa untuk SearchableSelect
  const studentOptions = useMemo(
    () =>
      allStudents
        // Mahasiswa yang BELUM di-add ke FORM ini DAN BELUM ADA di jadwal manapun
        .filter(s => !formData.student_ids.includes(s.id) && !allScheduledStudentIds.includes(s.id))
        .map(s => ({ id: s.id, label: `${s.name} (${s.nim})`, value: s.name.toLowerCase() })),
    [allStudents, formData.student_ids, allScheduledStudentIds]
  );

  const handleAddStudent = (id: RecordIdString) => {
    if (!formData.student_ids.includes(id)) {
      setFormData(p => ({ ...p, student_ids: [...p.student_ids, id] }));
    }
  };

  const handleRemoveStudent = (id: RecordIdString) => {
    if (formData.student_ids.length <= 1)
      return toast.error('1 schedule memiliki minimal 1 mahasiswa');
    setFormData(p => ({
      ...p,
      student_ids: p.student_ids.filter(sid => sid !== id),
    }));
  };

  // Mahasiswa yang ditampilkan (student yang ada di formData)
  const displayedStudents = useMemo(() => {
    return allStudents.filter(s => formData.student_ids.includes(s.id));
  }, [formData.student_ids, allStudents]);

  return (
    <TableRow className="border-b-8 border-secondary">
      {/* Date & Time */}
      <TableCell className="p-2">
        <div className="flex flex-col gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'outline'} size="sm" className="justify-start font-normal w-full">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {format(new Date(formData.date), 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[100]">
              <Calendar
                mode="single"
                selected={new Date(formData.date)}
                onSelect={date =>
                  setFormData(p => ({ ...p, date: date ? format(date, 'yyyy-MM-dd') : p.date }))
                }
              />
            </PopoverContent>
          </Popover>
          <div className="flex gap-1">
            <Input
              type="time"
              size={30}
              value={formData.start_time}
              onChange={e => setFormData(p => ({ ...p, start_time: e.target.value }))}
            />
            <Input
              type="time"
              size={30}
              value={formData.end_time}
              onChange={e => setFormData(p => ({ ...p, end_time: e.target.value }))}
            />
          </div>
        </div>
      </TableCell>

      {/* Room */}
      <TableCell className="p-2">
        <Select
          onValueChange={id => setFormData(p => ({ ...p, room: id === 'NULL' ? undefined : id }))}
          value={formData.room || ''}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NULL">-- No Room --</SelectItem>
            {rooms.map(r => (
              <SelectItem key={r.id} value={r.id}>
                {r.room_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Students */}
      <TableCell className="p-2 space-y-1">
        {/* Gunakan SearchableSelect untuk Student */}
        <SearchableSelect
          options={studentOptions}
          placeholder={`Add Student (${displayedStudents.length})`}
          onSelect={handleAddStudent}
          value={''} // Value kosong agar Combobox tetap pada placeholder setelah dipilih
          disabled={studentOptions.length === 0}
        />

        <div className="flex flex-col gap-1">
          {displayedStudents.map(student => (
            <Button
              variant={'outline'}
              key={student.id}
              className="inline-flex items-center rounded-md justify-between w-full px-1 py-0.5 text-xs h-auto"
            >
              {student.name} ({student.nim})
              <Button
                type="button"
                variant={'ghost'}
                size={'icon'}
                onClick={() => handleRemoveStudent(student.id)}
                className="ml-1 text-red-500 hover:text-red-700 h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </Button>
          ))}
        </div>
      </TableCell>

      {/* Examiners */}
      <TableCell className="p-2 space-y-1">
        <ExaminerInput
          lecturers={lecturers}
          roles={roles}
          onAdd={handleAddExaminerLocal}
          currentExaminers={formData.temp_examiners.map(e => e.id_lecturer)}
        />
        <div className="flex flex-col gap-1">
          {formData.temp_examiners.map((e, index) => {
            const lecturer = lecturers.find(l => l.id === e.id_lecturer);
            const role = roles.find(r => r.id === e.role);
            return lecturer && role ? (
              <Button
                variant={'outline'}
                key={index}
                className="inline-flex items-center w-full justify-between rounded-md px-1 py-0.5 text-xs h-auto"
              >
                {lecturer.name} ({role.role})
                <Button
                  variant={'ghost'}
                  type="button"
                  size={'icon'}
                  onClick={() => handleRemoveExaminerLocal(index)}
                  className="ml-1 text-red-500 hover:text-red-700 h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Button>
            ) : null;
          })}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="p-2 text-right">
        <Button onClick={handleSave} disabled={isSaving || !isFormValid} size="sm">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </Button>
      </TableCell>
    </TableRow>
  );
}

// =================================================================
// 4. KOMPONEN BARIS DATA (ScheduleRow) DENGAN IMMEDIATE SAVE
// =================================================================

function ScheduleRow({
  schedule,
  allStudents,
  lecturers,
  rooms,
  roles,
  onUpdateSchedule,
  onDeleteSchedule,
  onAddExaminer,
  onRemoveExaminer,
  onUpdateExaminer,
  allScheduledStudentIds, // FIX: Props baru untuk semua student ID yang sudah terjadwal
}: {
  schedule: MergedFinaleExamSchedule;
  allScheduledStudentIds: RecordIdString[];
} & Pick<
  ExaminationTableProps,
  | 'allStudents'
  | 'lecturers'
  | 'rooms'
  | 'roles'
  | 'onUpdateSchedule'
  | 'onDeleteSchedule'
  | 'onAddExaminer'
  | 'onRemoveExaminer'
  | 'onUpdateExaminer'
>) {
  // State lokal untuk inline editing
  const [localData, setLocalData] = useState<Partial<FinaleSchedulePayload>>({
    date: schedule.date,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    room: schedule.room_id || undefined,
    student_ids: schedule.student_ids,
  });

  // State untuk melacak proses penyimpanan
  const [isSaving, setIsSaving] = useState(false);

  // Sinkronisasi localData ketika schedule props berubah (setelah refetch dari CRUD lain)
  useEffect(() => {
    // Reset local state sepenuhnya ke data server (props schedule)
    setLocalData({
      date: schedule.date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      room: schedule.room_id || undefined,
      student_ids: schedule.student_ids,
    });
    // Hentikan status saving jika ada update dari luar (misal setelah Examiner CRUD)
    setIsSaving(false);
  }, [
    schedule.date,
    schedule.start_time,
    schedule.end_time,
    schedule.room_id,
    schedule.student_ids,
    schedule.id,
  ]);

  // FIX: Ganti handleLocalChange menjadi handleImmediateSave
  const handleImmediateSave = useCallback(
    async (
      key: keyof FinaleSchedulePayload,
      value: string | RecordIdString | RecordIdString[] | undefined
    ) => {
      // Update state lokal
      const updatedData = { ...localData, [key]: value };
      setLocalData(updatedData);

      // Cek apakah data benar-benar berubah dari server data sebelum save
      // (Pengecekan ini mungkin berlebihan karena kita hanya memanggil ini ketika ada perubahan user input)

      // Kirim permintaan API
      setIsSaving(true);
      try {
        await onUpdateSchedule(schedule.id, { [key]: value });
        toast.success(`${key.replace('_', ' ')} updated successfully.`, { duration: 1000 });
      } catch (error) {
        toast.error(`Failed to save ${key.replace('_', ' ')} update. ${error}`);
        // Jika gagal, mungkin perlu me-revert state lokal ke data lama, tapi kita biarkan saja
        // agar user bisa mencoba lagi, dan state akan disinkronkan dari server saat refetch.
      } finally {
        setIsSaving(false);
      }
    },
    [localData, schedule.id, onUpdateSchedule]
  );

  // Mahasiswa yang sudah di jadwal ini (untuk ditampilkan)
  const currentScheduleStudentIds = localData.student_ids || [];

  const handleAddStudent = (id: RecordIdString) => {
    const newStudentIds = [...currentScheduleStudentIds, id];
    handleImmediateSave('student_ids', newStudentIds);
  };

  const handleRemoveStudent = (id: RecordIdString) => {
    if (currentScheduleStudentIds.length <= 1)
      return toast.error('1 schedule memiliki minimal 1 mahasiswa');
    const newStudentIds = currentScheduleStudentIds.filter(sid => sid !== id);
    handleImmediateSave('student_ids', newStudentIds);
  };

  const handleAddExaminer = async (lecturerId: RecordIdString, roleId: RecordIdString) => {
    const isDuplicate = schedule.examiners.some(e => e.lecturer_id === lecturerId);
    if (isDuplicate) {
      toast.warning('Lecturer already added as examiner.');
      return;
    }
    await onAddExaminer({ id_lecturer: lecturerId, role: roleId, id_schedule: schedule.id });
  };

  const handleRemoveExaminer = async (examinerId: RecordIdString) => {
    await onRemoveExaminer(examinerId);
  };

  const handleUpdateExaminerRole = async (
    examinerId: RecordIdString,
    newRoleId: RecordIdString
  ) => {
    await onUpdateExaminer(examinerId, { role: newRoleId });
  };

  // Mahasiswa yang BISA ditambahkan (belum ada di jadwal manapun, kecuali jadwal ini)
  const availableStudentOptions = useMemo(
    () =>
      allStudents
        // Filter student yang tidak ada di jadwal lain (allScheduledStudentIds)
        // DAN student yang belum ada di jadwal saat ini (currentScheduleStudentIds)
        .filter(
          s => !allScheduledStudentIds.includes(s.id) && !currentScheduleStudentIds.includes(s.id)
        )
        .map(s => ({ id: s.id, label: `${s.name} (${s.nim})`, value: s.name.toLowerCase() })),
    [allStudents, allScheduledStudentIds, currentScheduleStudentIds]
  );

  // Mahasiswa yang ditampilkan (student yang ada di localData)
  const displayedStudents = useMemo(() => {
    return allStudents.filter(s => currentScheduleStudentIds.includes(s.id));
  }, [currentScheduleStudentIds, allStudents]);

  return (
    <TableRow className={isSaving ? 'bg-yellow-100/50 transition-all' : ''}>
      {/* Date & Time */}
      <TableCell className="p-2">
        <div className="flex flex-col gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                size="sm"
                className="justify-start font-normal w-full"
                disabled={isSaving}
              >
                {format(new Date(localData.date || schedule.date), 'EEE, dd MMM')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[100]">
              <Calendar
                mode="single"
                selected={new Date(localData.date || schedule.date)}
                onSelect={date =>
                  handleImmediateSave('date', date ? format(date, 'yyyy-MM-dd') : schedule.date)
                }
                disabled={isSaving}
              />
            </PopoverContent>
          </Popover>
          <div className="flex gap-1">
            <Input
              type="time"
              size={30}
              value={localData.start_time || ''}
              onChange={e => handleImmediateSave('start_time', e.target.value)}
              disabled={isSaving}
            />
            <Input
              type="time"
              size={30}
              value={localData.end_time || ''}
              onChange={e => handleImmediateSave('end_time', e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>
      </TableCell>

      {/* Room */}
      <TableCell className="p-2">
        <Select
          onValueChange={id => handleImmediateSave('room', id === 'NULL' ? undefined : id)}
          value={localData.room || ''}
          disabled={isSaving}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NULL">-- No Room --</SelectItem>
            {rooms.map(r => (
              <SelectItem key={r.id} value={r.id}>
                {r.room_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Students */}
      <TableCell className="p-2 space-y-1">
        {/* Gunakan SearchableSelect untuk Student */}
        <SearchableSelect
          options={availableStudentOptions}
          placeholder={`Add Student (${displayedStudents.length})`}
          onSelect={handleAddStudent}
          value={''}
          disabled={isSaving || availableStudentOptions.length === 0}
        />

        <div className="flex flex-col gap-1">
          {displayedStudents.map(student => (
            <Button
              variant="outline"
              key={student.id}
              className="inline-flex items-center px-1 py-0.5 text-xs justify-between h-auto"
              disabled={isSaving}
            >
              {student.name} ({student.nim})
              <Button
                variant="ghost"
                type="button"
                size={'icon'}
                onClick={() => handleRemoveStudent(student.id)}
                className="ml-1 text-red-500 hover:text-red-700 h-6 w-6"
                disabled={isSaving}
              >
                <X className="h-3 w-3" />
              </Button>
            </Button>
          ))}
        </div>
        {isSaving && <Loader2 className="h-4 w-4 animate-spin text-primary mt-2" />}
      </TableCell>

      {/* Examiners */}
      <TableCell className="p-2 space-y-1">
        <ExaminerInput
          lecturers={lecturers}
          roles={roles}
          onAdd={handleAddExaminer}
          currentExaminers={schedule.examiners.map(e => e.lecturer_id)}
        />
        <div className="flex flex-col gap-1">
          {schedule.examiners.map(e => (
            <ExaminerDisplay
              key={e.examiner_id}
              examiner={e}
              roles={roles}
              onUpdateRole={handleUpdateExaminerRole}
              onRemove={handleRemoveExaminer}
            />
          ))}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="p-2 text-right">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700"
          onClick={() => onDeleteSchedule(schedule.id)}
          disabled={isSaving}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// =================================================================
// 5. KOMPONEN UTAMA (ExaminationPlottingTable)
// =================================================================

export function ExaminationPlottingTable({
  finaleExamSchedules,
  allStudents,
  lecturers,
  rooms,
  roles,
  onCreateSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onAddExaminer,
  onUpdateExaminer,
  onRemoveExaminer,
  isLoading,
}: ExaminationTableProps) {
  // FIX: Hitung semua student ID yang sudah terjadwal (di jadwal manapun)
  const allScheduledStudentIds = useMemo(() => {
    return finaleExamSchedules.flatMap(s => s.student_ids);
  }, [finaleExamSchedules]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        {isLoading && (
          <div className="p-4 flex items-center justify-center text-primary">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading Schedules...
          </div>
        )}

        <Table className="w-full">
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="w-[20%]">Date & Time</TableHead>
              <TableHead className="w-[10%]">Room</TableHead>
              <TableHead className="w-[25%]">Students</TableHead>
              <TableHead className="w-[35%]">Examiners (Role)</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Baris Tambah Jadwal (Inline Input) */}
            <AddRow
              allStudents={allStudents}
              lecturers={lecturers}
              rooms={rooms}
              roles={roles}
              onCreateSchedule={onCreateSchedule}
              onAddExaminer={onAddExaminer}
              allScheduledStudentIds={allScheduledStudentIds} // FIX: Teruskan student ID yang sudah terjadwal
            />

            {/* Baris Data Jadwal (Inline Edit) */}
            {!isLoading && finaleExamSchedules.length > 0 ? (
              finaleExamSchedules.map(schedule => (
                <ScheduleRow
                  key={schedule.id}
                  schedule={schedule}
                  allStudents={allStudents}
                  lecturers={lecturers}
                  rooms={rooms}
                  roles={roles}
                  onUpdateSchedule={onUpdateSchedule}
                  onDeleteSchedule={onDeleteSchedule}
                  onAddExaminer={onAddExaminer}
                  onUpdateExaminer={onUpdateExaminer}
                  onRemoveExaminer={onRemoveExaminer}
                  allScheduledStudentIds={allScheduledStudentIds} // FIX: Teruskan student ID yang sudah terjadwal
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {!isLoading && 'No examination schedules found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// src/components/tables/ScheduleRowEditor.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

import { type StudentsResponse, type RecordIdString } from "@/types/pocketbase";
import { type NewSchedulePayload } from "@/hooks/use-finale-examination-data";

interface ScheduleRowEditorProps {
  allStudents: StudentsResponse[];
  onSave: (payload: NewSchedulePayload) => Promise<RecordIdString | null>;
  onCancel: () => void;
}

export function ScheduleRowEditor({
  allStudents,
  onSave,
  onCancel,
}: ScheduleRowEditorProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("08:30");
  const [room, setRoom] = useState("");
  const [studentId, setStudentId] = useState<RecordIdString>("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!date || !startTime || !endTime || !room || !studentId) {
      toast.warning("Incomplete Data", {
        description: "Please fill in all schedule fields.",
      });
      return;
    }

    const payload: NewSchedulePayload = {
      date: date.toISOString().split("T")[0], // YYYY-MM-DD
      start_time: `${startTime}:00`, // HH:MM:00
      end_time: `${endTime}:00`, // HH:MM:00
      room,
      student_ids: [studentId], // Asumsi hanya satu mahasiswa
    };

    setIsSaving(true);
    const newId = await onSave(payload);
    setIsSaving(false);

    if (newId) {
      // Reset state setelah berhasil disimpan
      setDate(undefined);
      setStartTime("07:00");
      setEndTime("08:30");
      setRoom("");
      setStudentId("");
      onCancel(); // Tutup mode editor setelah menyimpan
    }
  };

  return (
    <TableRow className="bg-blue-50/70 hover:bg-blue-100 transition-colors">
      {/* Cell Tanggal */}
      <TableCell className="align-middle border-r p-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[100]" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </TableCell>

      {/* Cell Waktu/Ruangan */}
      <TableCell className="align-middle border-r p-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-8 w-1/2 text-center"
              step="900" // 15 menit
            />
            <span>-</span>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-8 w-1/2 text-center"
              step="900"
            />
          </div>
          <Input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room (e.g., A1.1)"
            className="h-8"
          />
        </div>
      </TableCell>

      {/* Cell Mahasiswa */}
      <TableCell className="align-middle border-r p-2">
        <Select
          onValueChange={setStudentId}
          value={studentId}
          disabled={allStudents.length === 0}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          <SelectContent>
            {allStudents.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name} ({student.nim})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Cell Aksi */}
      <TableCell className="align-middle p-2">
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="w-full"
          >
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

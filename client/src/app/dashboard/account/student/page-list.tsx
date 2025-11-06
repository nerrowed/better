import { SimpleDataTable } from "@/components/tables/simple-data-table";
import { TABLE_COL } from "./page-list.columns";
import usePocketbase from "@/hooks/use-pocketbase";
import { useEffect, useState } from "react";
import type { StudentsRecord } from "@/types/pocketbase";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CSVImporter from "@/components/csv/CSVImporter";

export default function ListAccountStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentsRecord[]>([]);
  const { getRecords, isLoading, deleteRecord } = usePocketbase("students");

  const refreshData = () => {
    getRecords().then((res) => setStudents(res));
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between my-2">
        <h1 className="text-2xl font-bold">Akun Mahasiswa</h1>
        <div className="flex space-x-2">
          <CSVImporter type="students" onImportSuccess={refreshData} />

          <Button
            variant="default"
            onClick={() => navigate("/account/students/c")}
          >
            <Plus /> Tambah Manual
          </Button>
        </div>
      </div>
      <SimpleDataTable
        isLoading={isLoading}
        columns={TABLE_COL}
        data={students}
        onEdit={(data) => navigate(`e/${data.id}`)}
        onDelete={async (data) => {
          try {
            if (
              !confirm(
                `Are you sure you want to delete this lecturer with name "${data.name}"?`
              )
            )
              return;
            await deleteRecord(data.id);
            const updatedRecords = await getRecords();
            setStudents(updatedRecords);
            toast.success("Student deleted successfully.");
          } catch (error) {
            toast.error("Failed to delete student." + error);
          }
        }}
      />
    </div>
  );
}

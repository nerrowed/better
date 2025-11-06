import { SimpleDataTable } from "@/components/tables/simple-data-table";
import { TABLE_COL } from "./page-list.columns";
import usePocketbase from "@/hooks/use-pocketbase";
import { useEffect, useState } from "react";
import type { LecturersRecord } from "@/types/pocketbase";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
import CSVImporter from "@/components/csv/CSVImporter";

export default function ListAccountLecturers() {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState<LecturersRecord[]>([]);
  const { getRecords, isLoading, deleteRecord } = usePocketbase("lecturers");
  const { showAlertDialog } = useAlertDialog();

  const refreshData = () => {
    getRecords().then(setLecturers);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handler untuk delete, menggunakan AlertDialog
  const handleDelete = async (data: LecturersRecord) => {
    showAlertDialog({
      title: "Konfirmasi Penghapusan",
      description: `Anda yakin ingin menghapus dosen bernama "${data.name}"? Aksi ini tidak dapat dibatalkan.`,
      onContinue: async () => {
        try {
          await deleteRecord(data.id);
          refreshData(); // Refresh data setelah berhasil dihapus
          toast.success("Dosen berhasil dihapus.");
        } catch (error) {
          toast.error("Gagal menghapus dosen. " + error);
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between my-2">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">
          Manajemen Akun Dosen
        </h1>
        <div className="flex space-x-2">
          {/* Komponen Impor CSV baru */}
          <CSVImporter type="lecturers" onImportSuccess={refreshData} />

          {/* Tombol Tambah Manual yang sudah ada */}
          <Button
            variant="default"
            onClick={() => navigate("/account/lecturers/c")}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Manual
          </Button>
        </div>
      </div>

      <SimpleDataTable
        isLoading={isLoading}
        columns={TABLE_COL}
        data={lecturers}
        onEdit={(data) => navigate(`e/${data.id}`)}
        onDelete={handleDelete} // Menggunakan handler AlertDialog
      />
    </div>
  );
}

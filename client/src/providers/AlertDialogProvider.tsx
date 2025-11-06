// components/AlertDialogProvider.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DialogAction } from "@/hooks/use-alert-dialog";

// Definisikan props untuk Provider
interface AlertDialogProviderProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: DialogAction | undefined;
  onContinue: DialogAction;
  setOpen: (open: boolean) => void;
}

export function AlertDialogProvider({
  open,
  setOpen,
  title,
  description,
  onCancel,
  onContinue,
}: AlertDialogProviderProps) {
  // Gabungkan aksi dengan penutupan dialog
  const handleCancel = () => {
    setOpen(false);
    onCancel && onCancel();
  };

  const handleContinue = () => {
    // Pastikan setOpen dipanggil sebelum onContinue
    setOpen(false);
    onContinue();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Tombol Cancel */}
          {/* Tampilkan tombol Cancel hanya jika onCancel tersedia */}
          <AlertDialogCancel onClick={handleCancel}>Batal</AlertDialogCancel>

          {/* Tombol Continue */}
          <AlertDialogAction onClick={handleContinue}>
            Lanjutkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

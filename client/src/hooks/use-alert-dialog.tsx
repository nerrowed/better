// src/providers/AlertDialogContext.tsx
import { AlertDialogProvider } from "@/providers/AlertDialogProvider";
import { createContext, useContext, useState, useCallback } from "react";

export type DialogAction = () => void;

export interface DialogProps {
  title: string;
  description: string;
  onContinue: DialogAction;
  onCancel?: DialogAction;
}

interface UseAlertDialogResult {
  showAlertDialog: (props: DialogProps) => void;
  dialogProps: {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description: string;
    onCancel: DialogAction | undefined;
    onContinue: DialogAction;
  };
}

const AlertDialogContext = createContext<UseAlertDialogResult | null>(null);

export const useAlertDialog = (): UseAlertDialogResult => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    // Memastikan hook hanya dipanggil di bawah Provider
    throw new Error(
      "useAlertDialog must be used within an AlertDialogProvider."
    );
  }
  return context;
};

// --- Component Provider (Wrapper) ---
export const AlertDialogProviderWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [dialogState, setDialogState] = useState<
    Omit<DialogProps, "onCancel"> & { onCancel: DialogAction | undefined }
  >({
    title: "",
    description: "",
    onContinue: () => {},
    onCancel: undefined,
  });

  const showAlertDialog = useCallback((props: DialogProps) => {
    setDialogState({
      title: props.title,
      description: props.description,
      onContinue: props.onContinue,
      onCancel: props.onCancel,
    });
    setOpen(true);
  }, []);

  const hookValue: UseAlertDialogResult = {
    showAlertDialog,
    dialogProps: {
      open,
      setOpen,
      title: dialogState.title,
      description: dialogState.description,
      onContinue: dialogState.onContinue,
      onCancel: dialogState.onCancel,
    },
  };

  return (
    <AlertDialogContext.Provider value={hookValue}>
      {children}
      <AlertDialogProvider {...hookValue.dialogProps} />
    </AlertDialogContext.Provider>
  );
};

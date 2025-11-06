import { AlertDialogProviderWrapper } from "@/hooks/use-alert-dialog";
import type { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AlertDialogProviderWrapper>
        {children}
        <Toaster />
      </AlertDialogProviderWrapper>
    </ThemeProvider>
  );
}

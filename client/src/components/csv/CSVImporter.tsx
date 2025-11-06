import usePocketbase from '@/hooks/use-pocketbase';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { parseLecturerCSV, parseStudentCSV } from '@/lib/parser';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import type { SettingsRecord, LecturersRecord, StudentsRecord } from '@/types/pocketbase';
import { Link } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ClientResponseError } from 'pocketbase';

type ImportRecord = (Partial<LecturersRecord> | Partial<StudentsRecord>) & {
  password?: string;
  passwordConfirm?: string;
};

type PbErrorDataDetail = ClientResponseError['data'];

interface PbErrorData {
  [field: string]: PbErrorDataDetail;
}

const CSVImporter = ({
  onImportSuccess,
  type,
}: {
  onImportSuccess: () => void;
  type: 'students' | 'lecturers';
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<SettingsRecord[]>([]);

  const [errorLogs, setErrorLogs] = useState<{ record: ImportRecord; fieldErrors: PbErrorData }[]>(
    []
  ); // Ubah ke fieldErrors yang sudah diekstrak
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const { createRecord } = usePocketbase(type);
  const { getRecords: getSettingRecords } = usePocketbase('settings');

  const { showAlertDialog } = useAlertDialog();

  useEffect(() => {
    getSettingRecords({ filter: `key = 'url_format_import_${type}'` }).then(setSettings);
  }, [getSettingRecords, type]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error('Format File Salah', {
          description: 'Hanya file CSV yang didukung.',
        });
        return;
      }

      showAlertDialog({
        title: 'Konfirmasi Impor Data',
        description: `Anda yakin ingin mengimpor data ${type} dari file: ${file.name}? Ini akan membuat akun ${type} baru.`,
        onContinue: () => processCSV(file),
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processCSV = (file: File) => {
    setIsProcessing(true);
    setErrorLogs([]);

    const reader = new FileReader();

    reader.onload = async e => {
      const csvText = e.target?.result as string;
      const recordsToCreate: ImportRecord[] =
        type === 'lecturers' ? parseLecturerCSV(csvText) : parseStudentCSV(csvText);

      if (recordsToCreate.length === 0) {
        toast.warning('Peringatan', {
          description: `Tidak ada data ${type} valid ditemukan di file CSV.`,
        });
        setIsProcessing(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const newErrorLogs: { record: ImportRecord; fieldErrors: PbErrorData }[] = [];

      for (const record of recordsToCreate) {
        try {
          await createRecord(record);
          successCount++;
        } catch (error: unknown) {
          console.error('Error creating record:', record, error);
          errorCount++;

          // Ekstrak field errors dari struktur PocketBase error
          let fieldErrors: PbErrorData = {};
          if (
            error &&
            typeof error === 'object' &&
            'response' in (error as ClientResponseError) &&
            (error as ClientResponseError).response &&
            'data' in (error as ClientResponseError).response &&
            typeof (error as ClientResponseError).response.data === 'object'
          ) {
            // Ambil hanya bagian validation errors per field, seperti { email: { code, message } }
            const respData = (error as ClientResponseError).response.data;
            if (respData && typeof respData === 'object' && 'data' in respData) {
              // PocketBase kadang nest di response.data.data
              const nestedData = respData.data;
              if (nestedData && typeof nestedData === 'object') {
                fieldErrors = nestedData as PbErrorData;
              }
            } else if (respData && typeof respData === 'object') {
              // Atau langsung di response.data jika tidak nested
              fieldErrors = respData as PbErrorData;
            }
          }

          newErrorLogs.push({ record, fieldErrors });
        }
      }

      setErrorLogs(newErrorLogs);
      setIsProcessing(false);
      onImportSuccess();

      if (successCount > 0 || errorCount > 0) {
        toast.success('Impor Selesai', {
          description: `${successCount} akun ${type} berhasil dibuat. ${errorCount} gagal.`,
        });

        if (errorCount > 0) {
          setShowErrorDialog(true);
        }
      }
    };

    reader.onerror = () => {
      toast.error('Gagal Membaca File', {
        description: 'Terjadi kesalahan saat membaca file.',
      });
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isProcessing}
      />
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Impor CSV
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {settings && settings[0]?.value ? (
            <Link
              to={settings[0]?.value}
              target="_blank"
              className="underline-offset-4 underline flex"
            >
              <LinkIcon size={16} /> Unduh Template CSV disini
            </Link>
          ) : type === 'lecturers' ? (
            'Format yang diharapkan: "name", "nip", "nidn", "email", "password"'
          ) : (
            'Format yang diharapkan: "name", "nim", "email", "password"'
          )}
        </TooltipContent>
      </Tooltip>

      {/* Modal Dialog untuk Error Logs */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error Impor Data</DialogTitle>
            <DialogDescription>
              Terdapat {errorLogs.length} data yang gagal diimpor. Berikut detail error validasi per
              field:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {errorLogs.map((log, index) => (
              <div key={index} className="border p-4 rounded-md bg-background">
                <p className="font-semibold">Data Bermasalah (Baris {index + 1}):</p>
                <pre className="text-sm overflow-x-auto">{JSON.stringify(log.record, null, 2)}</pre>
                <p className="font-semibold mt-2">Error Validasi:</p>
                {Object.keys(log.fieldErrors).length > 0 ? (
                  <ul className="text-sm text-red-700 list-disc pl-5">
                    {Object.entries(log.fieldErrors).map(([field, detail]) => (
                      <li key={field}>
                        <strong>{field}:</strong> {detail.message} (code: {detail.code})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-red-700">
                    Error tidak diketahui atau bukan validasi field.
                  </p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CSVImporter;

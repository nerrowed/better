import { Input } from "@/components/ui/input";
import usePocketbase from "@/hooks/use-pocketbase";
import { useEffect, useState } from "react";
import type { SettingsRecord } from "@/types/pocketbase";
import { toast } from "sonner";
import { convertSnakeCaseToTitleCase } from "@/lib/mapper";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingPage() {
  const { getRecords, updateRecord } = usePocketbase("settings");
  const [settings, setSettings] = useState<SettingsRecord[]>([]);

  useEffect(() => {
    getRecords().then(setSettings);
  }, []);

  async function onSubmit() {
    try {
      await Promise.all(
        settings.map(async (settingItem) => {
          return updateRecord(settingItem.id, settingItem);
        })
      );
      toast.success("Student updated successfully");
    } catch (error) {
      toast.error(`Failed to update student. ${error}`);
    }
  }

  const handleSettingChange = (id: string, newValue: string) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, value: newValue } : setting
      )
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between my-2">
        <h1 className="text-2xl font-bold">Setting</h1>
      </div>
      <div className="space-y-6">
        {settings.map((settingItem) => (
          <div className="space-y-3">
            <Label htmlFor={settingItem.id}>
              {convertSnakeCaseToTitleCase(settingItem.key || "")}
            </Label>
            <Input
              id={settingItem.id}
              value={settingItem.value}
              onChange={(e) =>
                handleSettingChange(settingItem.id, e.target.value)
              }
            />
          </div>
        ))}
        <Button onClick={onSubmit}>Save</Button>
      </div>
    </div>
  );
}

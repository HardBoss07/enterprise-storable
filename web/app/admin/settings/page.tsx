"use client";

import { useEffect, useState, useMemo } from "react";
import { GlobalSettingsDto } from "@/types/api";
import { getSettings, updateSettings } from "@/lib/api/admin";
import { Button } from "@/components/ui/Button";
import { Save, Clock, Trash2, Search, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tzSearch, setTzSearch] = useState("");
  const [isTzOpen, setIsTzOpen] = useState(false);
  const { showToast } = useToast();

  const allTimezones = useMemo(() => {
    return (Intl as any).supportedValuesOf("timeZone") as string[];
  }, []);

  const filteredTimezones = useMemo(() => {
    if (!tzSearch) return allTimezones.slice(0, 100);
    return allTimezones
      .filter((tz) => tz.toLowerCase().includes(tzSearch.toLowerCase()))
      .slice(0, 100);
  }, [tzSearch, allTimezones]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        showToast("Failed to fetch settings", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    try {
      setIsSaving(true);
      await updateSettings(settings);
      showToast("Settings updated successfully", "success");
    } catch (error) {
      showToast("Failed to update settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Trash Retention Section */}
      <section className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-3 text-neutral-100">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
            <Trash2 size={20} />
          </div>
          <h2 className="text-lg font-semibold">Trash Management</h2>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-400">
            Trash Retention Days
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              value={settings.trashRetentionDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  trashRetentionDays: parseInt(e.target.value) || 0,
                })
              }
              className="w-32 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-accent transition-all text-neutral-100"
            />
            <span className="text-sm text-neutral-500 italic">
              Items older than this will be automatically purged from the trash.
            </span>
          </div>
        </div>
      </section>

      {/* Timezone Section */}
      <section className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6 shadow-lg space-y-4 relative">
        <div className="flex items-center gap-3 text-neutral-100">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Clock size={20} />
          </div>
          <h2 className="text-lg font-semibold">System Timezone</h2>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-400">
            Default Server Timezone
          </label>

          <div className="relative">
            <button
              onClick={() => setIsTzOpen(!isTzOpen)}
              className="w-full text-left bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-accent transition-all text-neutral-100 flex justify-between items-center"
            >
              <span>{settings.systemTimezone}</span>
              <Search size={16} className="text-neutral-500" />
            </button>

            {isTzOpen && (
              <div className="absolute z-50 w-full mt-2 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-neutral-700">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                      size={14}
                    />
                    <input
                      autoFocus
                      placeholder="Search timezones..."
                      value={tzSearch}
                      onChange={(e) => setTzSearch(e.target.value)}
                      className="w-full bg-neutral-900 border-none rounded-md pl-9 pr-4 py-2 text-sm focus:ring-0 text-neutral-200"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-auto py-1">
                  {filteredTimezones.map((tz) => (
                    <button
                      key={tz}
                      onClick={() => {
                        setSettings({ ...settings, systemTimezone: tz });
                        setIsTzOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors hover:bg-neutral-700/50",
                        settings.systemTimezone === tz
                          ? "text-primary-accent bg-primary-accent/5"
                          : "text-neutral-300",
                      )}
                    >
                      {tz}
                      {settings.systemTimezone === tz && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-neutral-500">
            This affects display dates and background tasks like trash cleanup
            schedules.
          </p>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8"
        >
          {isSaving ? <Spinner size="sm" /> : <Save size={20} />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

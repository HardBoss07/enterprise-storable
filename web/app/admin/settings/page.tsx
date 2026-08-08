'use client';

import { useEffect, useState, useMemo } from 'react';
import { GlobalSettingsDto } from '@/types/api';
import { getSettings, updateSettings, revokeAllSessions } from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { Save, Clock, Trash2, Search, Check, ShieldAlert, LogOut } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [tzSearch, setTzSearch] = useState('');
  const [isTzOpen, setIsTzOpen] = useState(false);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const allTimezones = useMemo(() => {
    return (Intl as any).supportedValuesOf('timeZone') as string[];
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
        showToast('Failed to fetch settings', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  const handleSave = async () => {
    if (!settings) return;
    try {
      setIsSaving(true);
      await updateSettings(settings);
      showToast('Settings updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNuclearReset = async () => {
    const isConfirmed = await confirm({
      title: 'Nuclear Session Reset',
      message:
        'This will immediately invalidate ALL active user sessions across the entire system. Every user (except the root admin) will be forcibly logged out and required to sign in again. Use this only in emergencies or security breaches.',
      confirmLabel: 'Invalidate All Sessions',
      variant: 'danger',
    });

    if (isConfirmed) {
      try {
        setIsRevoking(true);
        const response = await revokeAllSessions();
        showToast(response.message, 'success');
      } catch (error) {
        showToast('Failed to revoke sessions', 'error');
      } finally {
        setIsRevoking(false);
      }
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Trash Retention Section */}
      <section className="bg-bg-sidebar border-surface-300 space-y-4 rounded-2xl border p-6 shadow-2xl">
        <div className="text-text-primary flex items-center gap-3">
          <div className="rounded-lg bg-red-500/10 p-2 text-red-500">
            <Trash2 size={20} />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Trash Management</h2>
        </div>

        <div className="space-y-2">
          <label className="text-text-muted block text-sm font-bold tracking-tighter uppercase">
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
              className="bg-surface-100 border-surface-300 focus:ring-primary text-text-primary w-32 rounded-xl border px-4 py-2 transition-all focus:ring-2 focus:outline-none"
            />
            <span className="text-text-muted text-sm">
              Items older than this will be automatically purged from the trash.
            </span>
          </div>
        </div>
      </section>

      {/* Timezone Section */}
      <section className="bg-bg-sidebar border-surface-300 relative space-y-4 rounded-2xl border p-6 shadow-2xl">
        <div className="text-text-primary flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-lg p-2">
            <Clock size={20} />
          </div>
          <h2 className="text-lg font-bold tracking-tight">System Timezone</h2>
        </div>

        <div className="space-y-2">
          <label className="text-text-muted block text-sm font-bold tracking-tighter uppercase">
            Default Server Timezone
          </label>

          <div className="relative">
            <button
              onClick={() => setIsTzOpen(!isTzOpen)}
              className="bg-surface-100 border-surface-300 focus:ring-primary text-text-primary flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all focus:ring-2 focus:outline-none"
            >
              <span className="font-medium">{settings.systemTimezone}</span>
              <Search size={16} className="text-text-muted" />
            </button>

            {isTzOpen && (
              <div className="bg-bg-sidebar border-surface-300 animate-in fade-in zoom-in-95 absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border shadow-2xl duration-150">
                <div className="border-surface-300 bg-surface-100 border-b p-2">
                  <div className="relative">
                    <Search
                      className="text-text-muted absolute top-1/2 left-3 -translate-y-1/2"
                      size={14}
                    />
                    <input
                      autoFocus
                      placeholder="Search timezones..."
                      value={tzSearch}
                      onChange={(e) => setTzSearch(e.target.value)}
                      className="bg-surface-200 text-text-primary w-full rounded-lg border-none py-2 pr-4 pl-9 text-sm focus:ring-0"
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
                        'hover:bg-surface-200 flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors',
                        settings.systemTimezone === tz
                          ? 'text-primary bg-primary/5 font-bold'
                          : 'text-text-secondary',
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
          <p className="text-text-muted text-xs">
            This affects display dates and background tasks like trash cleanup schedules.
          </p>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-bg-sidebar space-y-6 rounded-2xl border border-red-500/20 p-6 shadow-2xl">
        <div className="flex items-center gap-3 text-red-500">
          <div className="rounded-lg bg-red-500/10 p-2">
            <ShieldAlert size={20} />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Security & Sessions</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-text-primary text-sm font-bold tracking-tighter uppercase">
              Nuclear Session Reset
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              In case of a security breach or system-wide maintenance, you can instantly log out all
              active users. This will invalidate all existing authentication tokens globally.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={handleNuclearReset}
            disabled={isRevoking}
            className="group w-full border border-red-500/20 bg-red-500/5 py-6 font-bold text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white"
          >
            {isRevoking ? (
              <Spinner size="sm" />
            ) : (
              <div className="flex items-center gap-3">
                <LogOut size={20} className="transition-transform group-hover:translate-x-1" />
                <span>Invalidate All User Sessions</span>
              </div>
            )}
          </Button>
        </div>
      </section>

      <div className="flex justify-end pt-4 pb-12">
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-8">
          {isSaving ? <Spinner size="sm" /> : <Save size={20} />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

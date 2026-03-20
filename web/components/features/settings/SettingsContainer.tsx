"use client";

import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, Trash2, ShieldAlert } from "lucide-react";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { cn } from "@/lib/utils";

/**
 * Organism: Main container for user account settings.
 * Coordinates email updates, password changes, and account deletion.
 *
 * @returns {JSX.Element} The rendered SettingsContainer component.
 */
export function SettingsContainer() {
  const {
    user,
    email,
    setEmail,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isUpdatingEmail,
    isUpdatingPassword,
    isDeletingAccount,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleUpdateEmail,
    handleUpdatePassword,
    handleDeleteAccount,
  } = useSettings();

  return (
    <div className="max-w-4xl space-y-8">
      {/* Email Section */}
      <section className="rounded-2xl border border-surface-300 bg-surface-200 p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Mail size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Email Address
            </h2>
            <p className="text-sm text-text-muted">
              Update your account email address.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="ml-1 text-sm font-bold text-text-secondary">
              New Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-surface-300 bg-surface-100 px-4 py-3 text-text-primary outline-none transition-all focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" isLoading={isUpdatingEmail} className="px-8">
            Update Email
          </Button>
        </form>
      </section>

      {/* Password Section */}
      <section className="rounded-2xl border border-surface-300 bg-surface-200 p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Lock size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Change Password
            </h2>
            <p className="text-sm text-text-muted">
              Ensure your account is using a long, random password to stay
              secure.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="ml-1 text-sm font-bold text-text-secondary">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-surface-300 bg-surface-100 px-4 py-3 text-text-primary outline-none transition-all focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div className="hidden md:block"></div>

            <div className="flex flex-col gap-2">
              <label className="ml-1 text-sm font-bold text-text-secondary">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-surface-300 bg-surface-100 px-4 py-3 text-text-primary outline-none transition-all focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="ml-1 text-sm font-bold text-text-secondary">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-surface-300 bg-surface-100 px-4 py-3 text-text-primary outline-none transition-all focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>
          <Button type="submit" isLoading={isUpdatingPassword} className="px-8">
            Update Password
          </Button>
        </form>
      </section>

      {/* Danger Zone - Hidden for root user */}
      {user?.id !== "f43c0bcf-11e4-4629-b072-321ccd04e72a" && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2">
              <ShieldAlert size={20} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
              <p className="text-sm text-text-muted">
                Irreversible and destructive actions.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-xl border border-red-500/20 bg-red-500/10 p-6 md:flex-row md:items-center">
            <div className="space-y-1">
              <h3 className="font-bold text-text-primary">Delete Account</h3>
              <p className="text-sm max-w-md text-text-muted">
                Permanently delete your account and all associated data. This
                action is irreversible.
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete Account
            </Button>
          </div>
        </section>
      )}

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />
    </div>
  );
}

export default SettingsContainer;

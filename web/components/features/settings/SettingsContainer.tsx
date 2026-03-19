"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";
import { userApi } from "@/lib/api/user";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, Trash2, ShieldAlert } from "lucide-react";
import DeleteAccountModal from "./DeleteAccountModal";

/**
 * Main container for user account settings.
 */
export default function SettingsContainer() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Sync email state when user profile is loaded
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsUpdatingEmail(true);
    try {
      await userApi.changeEmail({ newEmail: email });
      showToast("Email updated successfully.", "success");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update email.", "error");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("All password fields are required.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 8) {
        showToast("New password must be at least 8 characters long.", "error");
        return;
    }

    setIsUpdatingPassword(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      showToast("Password updated successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update password.", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async (password: string) => {
    setIsDeletingAccount(true);
    try {
      await userApi.deleteAccount({ password });
      showToast("Account deleted. Farewell.", "success");
      setIsDeleteModalOpen(false);
      logout();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to delete account.", "error");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Email Section */}
      <section className="bg-surface-200 border border-surface-300 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Email Address</h2>
            <p className="text-sm text-text-muted">Update your account email address.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-secondary ml-1">New Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
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
      <section className="bg-surface-200 border border-surface-300 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lock size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Change Password</h2>
            <p className="text-sm text-text-muted">Ensure your account is using a long, random password to stay secure.</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary ml-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                required
              />
            </div>
            <div className="hidden md:block"></div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary ml-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary ml-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
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
        <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <ShieldAlert size={20} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
              <p className="text-sm text-text-muted">Irreversible and destructive actions.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="space-y-1">
              <h3 className="font-bold text-text-primary">Delete Account</h3>
              <p className="text-sm text-text-muted max-w-md">
                Permanently delete your account and all associated data. This action is irreversible.
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

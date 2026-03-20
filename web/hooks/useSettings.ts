import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { userApi } from "@/lib/api/user";

/**
 * Custom hook for handling user settings logic.
 * Extracts email updates, password changes, and account deletion from the UI layer.
 *
 * @returns {object} State and handlers for user settings.
 */
export function useSettings() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

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

  /**
   * Handles the email update operation.
   * @param {React.FormEvent} event - The form submission event.
   */
  const handleUpdateEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setIsUpdatingEmail(true);
    try {
      await userApi.changeEmail({ newEmail: email });
      showToast("Email updated successfully.", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to update email.",
        "error",
      );
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  /**
   * Handles the password update operation.
   * @param {React.FormEvent} event - The form submission event.
   */
  const handleUpdatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
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
      showToast(
        error.response?.data?.message || "Failed to update password.",
        "error",
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  /**
   * Handles the account deletion operation.
   * @param {string} password - The user's password for confirmation.
   */
  const handleDeleteAccount = async (password: string) => {
    setIsDeletingAccount(true);
    try {
      await userApi.deleteAccount({ password });
      showToast("Account deleted. Farewell.", "success");
      setIsDeleteModalOpen(false);
      logout();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to delete account.",
        "error",
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return {
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
  };
}

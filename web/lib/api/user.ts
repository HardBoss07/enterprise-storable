import { apiRequest } from "./client";

/**
 * API client for user profile and account management.
 */
export const userApi = {
  /**
   * Updates the password for the current user.
   */
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return apiRequest("/api/users/me/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  /**
   * Updates the email address for the current user.
   */
  changeEmail: async (data: { newEmail: string }) => {
    return apiRequest("/api/users/me/email", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  /**
   * Permanently deletes the current user's account.
   */
  deleteAccount: async (data: { password: string }) => {
    return apiRequest("/api/users/me", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }
};

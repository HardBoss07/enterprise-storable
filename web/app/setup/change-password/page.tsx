"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api/user";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, CheckCircle2, Lock } from "lucide-react";

/**
 * Page: Mandatory password change flow for first-time login or insecure accounts.
 */
export default function ChangePasswordSetup() {
  const [currentPassword, setCurrentPassword] = useState("root");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("error");
      setErrorMessage("New password must be at least 8 characters long");
      return;
    }

    if (newPassword === "root") {
      setStatus("error");
      setErrorMessage("New password cannot be 'root'");
      return;
    }

    setStatus("loading");
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setStatus("success");
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to update password");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black">PASSWORD UPDATED!</h1>
        <p className="text-text-secondary">
          Your account is now secure. Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="max-w-md w-full space-y-8 bg-surface-100 border border-surface-200 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

        <div className="text-center space-y-2 relative">
          <div className="inline-flex p-3 bg-accent/10 text-accent rounded-2xl mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Security Setup
          </h1>
          <p className="text-text-secondary">
            Since this is your first login with the default credentials, you
            must change your password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {status === "error" && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center gap-3">
              <ShieldAlert size={18} />
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-surface-200 border border-surface-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all text-white font-medium"
                  placeholder="Enter secure password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-200 border border-surface-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all text-white font-medium"
                  placeholder="Repeat new password"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full py-6 text-lg font-black rounded-xl shadow-xl shadow-primary/20 uppercase"
            disabled={status === "loading"}
          >
            {status === "loading" ? "UPDATING..." : "UPDATE & CONTINUE"}
          </Button>
        </form>
      </div>
    </div>
  );
}

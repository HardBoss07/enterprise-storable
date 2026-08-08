'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api/user';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

/**
 * Page: Mandatory password change flow for first-time login or insecure accounts.
 */
export default function ChangePasswordSetup() {
  const [currentPassword, setCurrentPassword] = useState('root');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setStatus('error');
      setErrorMessage('New password must be at least 8 characters long');
      return;
    }

    if (newPassword === 'root') {
      setStatus('error');
      setErrorMessage("New password cannot be 'root'");
      return;
    }

    setStatus('loading');
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setStatus('success');
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to update password');
    }
  };

  if (status === 'success') {
    return (
      <div className="animate-in zoom-in-95 flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-500">
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
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="bg-surface-100 border-surface-200 relative w-full max-w-md space-y-8 overflow-hidden rounded-[2rem] border p-10 shadow-2xl">
        {/* Decorative background */}
        <div className="bg-primary/5 absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full blur-3xl" />

        <div className="relative space-y-2 text-center">
          <div className="bg-accent/10 text-accent mb-4 inline-flex rounded-2xl p-3">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Security Setup</h1>
          <p className="text-text-secondary">
            Since this is your first login with the default credentials, you must change your
            password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-6">
          {status === 'error' && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-500">
              <ShieldAlert size={18} />
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-text-muted ml-1 text-xs font-black tracking-widest uppercase">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="text-text-muted absolute top-1/2 left-4 -translate-y-1/2"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-surface-200 border-surface-300 focus:ring-primary w-full rounded-xl border py-4 pr-4 pl-12 font-medium text-white transition-all outline-none focus:ring-2"
                  placeholder="Enter secure password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-text-muted ml-1 text-xs font-black tracking-widest uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="text-text-muted absolute top-1/2 left-4 -translate-y-1/2"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-surface-200 border-surface-300 focus:ring-primary w-full rounded-xl border py-4 pr-4 pl-12 font-medium text-white transition-all outline-none focus:ring-2"
                  placeholder="Repeat new password"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="shadow-primary/20 w-full rounded-xl py-6 text-lg font-black uppercase shadow-xl"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'UPDATING...' : 'UPDATE & CONTINUE'}
          </Button>
        </form>
      </div>
    </div>
  );
}

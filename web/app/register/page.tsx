'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { registerUser as registerApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    try {
      const res = await registerApi({ username, email, password });
      login(res.token, res.username, res.email, res.userId, res.role);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/">
          <Image src="/logo/logo.svg" alt="Storable Logo" width={180} height={40} priority />
        </Link>
      </div>
      <div className="w-full max-w-md rounded-lg border border-neutral-700 bg-neutral-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Create your account</h2>
        {error && (
          <div className="mb-4 rounded border border-red-800 bg-red-900/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">Username</label>
            <input
              type="text"
              className="focus:ring-primary w-full rounded border border-neutral-700 bg-neutral-900 p-2 text-white transition-all outline-none focus:ring-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">Email</label>
            <input
              type="email"
              className="focus:ring-primary w-full rounded border border-neutral-700 bg-neutral-900 p-2 text-white transition-all outline-none focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">Password</label>
            <input
              type="password"
              className="focus:ring-primary w-full rounded border border-neutral-700 bg-neutral-900 p-2 text-white transition-all outline-none focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">
              Repeat Password
            </label>
            <input
              type="password"
              className={cn(
                'w-full rounded border bg-neutral-900 p-2 text-white transition-all outline-none focus:ring-2',
                confirmPassword && password !== confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:ring-primary border-neutral-700',
              )}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              id="terms"
              type="checkbox"
              className="text-primary focus:ring-primary accent-primary mt-1 h-4 w-4 cursor-pointer rounded border-neutral-700 bg-neutral-900"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
            />
            <label
              htmlFor="terms"
              className="cursor-pointer text-xs leading-tight text-neutral-400 select-none"
            >
              I agree to the{' '}
              <Link href="/terms" target="_blank" className="text-accent font-bold hover:underline">
                Terms of Service
              </Link>{' '}
              and I have read the{' '}
              <Link
                href="/privacy"
                target="_blank"
                className="text-accent font-bold hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark shadow-primary/20 mt-2 w-full rounded-xl px-4 py-3 font-black tracking-tight text-black uppercase shadow-lg transition-all active:scale-95"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

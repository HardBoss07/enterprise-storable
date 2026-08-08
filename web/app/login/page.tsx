'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loginUser as loginApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginApi({ username, password });
      // Phase 10: Implement "First Login" interceptor.
      // If user.password == 'root', redirect to a mandatory /setup/change-password flow.
      const isFirstLogin = password === 'root';
      login(res.token, res.username, res.email, res.userId, res.role, isFirstLogin);
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Login to your account</h2>
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
            <label className="mb-1 block text-sm font-medium text-neutral-300">Password</label>
            <input
              type="password"
              className="focus:ring-primary w-full rounded border border-neutral-700 bg-neutral-900 p-2 text-white transition-all outline-none focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark shadow-primary/20 w-full rounded-xl px-4 py-3 font-black tracking-tight text-black uppercase shadow-lg transition-all active:scale-95"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-neutral-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent font-bold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

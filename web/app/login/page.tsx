"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { loginUser as loginApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginApi({ username, password });
      login(res.token, res.username, res.userId, res.role);
      // login function handles redirect usually, but duplicate just in case
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/">
          <Image
            src="/logo/logo.svg"
            alt="Storable Logo"
            width={180}
            height={40}
            priority
          />
        </Link>
      </div>
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-neutral-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login to your account
        </h2>
        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm border border-red-800">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-300">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-300">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

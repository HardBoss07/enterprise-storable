"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { register as registerApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await registerApi(username, email, password);
      login(res.token, res.username, res.role);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-neutral-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create Account
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
              Email
            </label>
            <input
              type="email"
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-300">
              Repeat Password
            </label>
            <input
              type="password"
              className={cn(
                "w-full bg-neutral-900 border rounded p-2 text-white outline-none transition-all focus:ring-2",
                confirmPassword && password !== confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-neutral-700 focus:ring-blue-500"
              )}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

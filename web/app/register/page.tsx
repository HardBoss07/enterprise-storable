"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { registerUser as registerApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

    if (!acceptedTerms) {
      setError("You must accept the Terms of Service and Privacy Policy");
      return;
    }

    try {
      const res = await registerApi({ username, email, password });
      login(res.token, res.username, res.email, res.userId, res.role);
    } catch (err: any) {
      setError(err.message || "Registration failed");
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
          Create your account
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
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
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
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
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
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
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
                  : "border-neutral-700 focus:ring-primary",
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
              className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-primary focus:ring-primary accent-primary cursor-pointer"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
            />
            <label
              htmlFor="terms"
              className="text-xs text-neutral-400 leading-tight cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-accent hover:underline font-bold"
              >
                Terms of Service
              </Link>{" "}
              and I have read the{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="text-accent hover:underline font-bold"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-black font-black py-3 px-4 rounded-xl transition-all uppercase tracking-tight shadow-lg shadow-primary/20 active:scale-95 mt-2"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline font-bold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

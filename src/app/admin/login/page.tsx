"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim() || !password.trim()) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        toast.error(data.error || "Login failed");
      } else {
        toast.success(`Welcome back, ${data.user.name}`);
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
            S
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">SMARTCASEBD Admin</h1>
          <p className="text-xs text-zinc-400">Management & Operations Portal</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Phone / Email *
            </label>
            <input
              type="text"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder="e.g. 01700000000 or admin@smartcasebd.com"
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs font-semibold text-rose-500 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900">{error}</p>}

          <Button type="submit" variant="accent" size="lg" isLoading={loading} className="w-full font-bold shadow-md">
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="text-center text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Protected by Role-Based Access Control</span>
          </p>
        </div>
      </div>
    </div>
  );
}

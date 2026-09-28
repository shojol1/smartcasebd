"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function CustomerLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Guest checkout is enabled! You can place orders instantly without logging in.");
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-bold mx-auto text-xl">
          S
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-900">Sign In to SMARTCASEBD</h1>
        <p className="text-xs text-zinc-500">Access your order history and saved delivery addresses</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-sm">
        <Input label="BD Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01700000000" />
        <Input label="Password *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full font-bold">
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <div className="text-center pt-2">
          <Link href="/checkout" className="text-xs text-brand-600 font-bold hover:underline">
            Fast Guest Checkout Available (No Password Needed)
          </Link>
        </div>
      </form>
    </div>
  );
}

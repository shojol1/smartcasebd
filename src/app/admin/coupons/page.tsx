"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatBDT } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"FIXED" | "PERCENTAGE">("FIXED");
  const [discountValue, setDiscountValue] = useState("100");
  const [minOrderValue, setMinOrderValue] = useState("1000");
  const [usageLimit, setUsageLimit] = useState("500");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderValue: parseFloat(minOrderValue) || 0,
          usageLimit: usageLimit ? parseInt(usageLimit) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create coupon");
      } else {
        toast.success(`Coupon ${data.coupon.code} created!`);
        setCode("");
        setIsOpen(false);
        fetchCoupons();
      }
    } catch {
      toast.error("Network error creating coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Coupon & Promo Code System</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Manage promotional discount codes, minimum order rules & usage caps</p>
        </div>
        <Button onClick={() => setIsOpen(true)} variant="accent" size="md" className="font-bold">
          <Plus className="w-4 h-4 mr-2" /> Create Promo Coupon
        </Button>
      </div>

      {/* CREATE MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form onSubmit={handleCreateCoupon} className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create Promo Coupon</h3>

            <Input label="Coupon Code *" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER150" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e: any) => setDiscountType(e.target.value)}
                  className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="FIXED">Fixed Amount (BDT)</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                </select>
              </div>

              <Input label="Value *" type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Order Value (BDT)" type="number" value={minOrderValue} onChange={(e) => setMinOrderValue(e.target.value)} placeholder="1000" />
              <Input label="Usage Limit" type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="500" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" size="sm" isLoading={isSubmitting}>
                Save Coupon
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Min Order</th>
              <th className="p-4">Usage Counter</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-black text-brand-400">{c.code}</td>
                  <td className="p-4 font-bold text-white">
                    {c.discountType === "FIXED" ? formatBDT(c.discountValue) : `${c.discountValue}% OFF`}
                  </td>
                  <td className="p-4 font-semibold text-zinc-400">{formatBDT(c.minOrderValue)}</td>
                  <td className="p-4 font-semibold">
                    {c.usageCount} / {c.usageLimit || "∞"} used
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-900">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

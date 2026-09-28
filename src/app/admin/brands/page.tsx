"use client";

import React, { useState, useEffect } from "react";
import { Layers, Plus, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (err) {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logo, description }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create brand");
      } else {
        toast.success(`Brand ${data.brand.name} created!`);
        setName("");
        setLogo("");
        setDescription("");
        setIsOpen(false);
        fetchBrands();
      }
    } catch {
      toast.error("Network error creating brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Phone Brand Management</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Manage smartphone manufacturers (Apple, Samsung, Pixel, OnePlus)</p>
        </div>
        <Button onClick={() => setIsOpen(true)} variant="accent" size="md" className="font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add New Brand
        </Button>
      </div>

      {/* CREATE BRAND MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form onSubmit={handleCreateBrand} className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add New Phone Brand</h3>
            <Input label="Brand Name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Xiaomi" />
            <Input label="Logo URL (Optional)" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://..." />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" size="sm" isLoading={isSubmitting}>
                Save Brand
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* BRANDS TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="p-4">Brand Logo</th>
              <th className="p-4">Brand Name</th>
              <th className="p-4">Series Count</th>
              <th className="p-4">Products Linked</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  Loading brands...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No brands found.
                </td>
              </tr>
            ) : (
              brands.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <img src={b.logo || "https://via.placeholder.com/40"} alt={b.name} className="w-10 h-10 object-contain rounded-lg bg-zinc-950 p-1" />
                  </td>
                  <td className="p-4 font-bold text-white">{b.name}</td>
                  <td className="p-4 font-semibold">{b.series?.length || 0} Series</td>
                  <td className="p-4 font-semibold">{b._count?.products || 0} Cases</td>
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

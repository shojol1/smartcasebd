"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, Plus, CheckCircle, SmartphoneNfc } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function AdminModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [isOpen, setIsOpen] = useState(false);
  const [seriesId, setSeriesId] = useState("");
  const [name, setName] = useState("");
  const [releaseYear, setReleaseYear] = useState("2026");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchModelsAndBrands = async () => {
    try {
      const [modelsRes, brandsRes] = await Promise.all([
        fetch("/api/admin/models"),
        fetch("/api/admin/brands"),
      ]);

      const modelsData = await modelsRes.json();
      const brandsData = await brandsRes.json();

      setModels(modelsData.models || []);
      setBrands(brandsData.brands || []);

      // Pre-select first series if available
      const firstSeries = brandsData.brands?.[0]?.series?.[0]?.id;
      if (firstSeries) setSeriesId(firstSeries);
    } catch {
      toast.error("Failed to load models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelsAndBrands();
  }, []);

  const handleCreateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !seriesId) {
      toast.error("Select a series and enter model name");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesId,
          name,
          releaseYear: parseInt(releaseYear) || 2026,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create model");
      } else {
        toast.success(`Phone Model ${data.phoneModel.name} created!`);
        setName("");
        setIsOpen(false);
        fetchModelsAndBrands();
      }
    } catch {
      toast.error("Network error creating phone model");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Flagship Phone Model Architecture</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Add flagship models (e.g., iPhone 17 Pro Max, Galaxy S26 Ultra) to link case products
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} variant="accent" size="md" className="font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add Phone Model
        </Button>
      </div>

      {/* CREATE MODEL MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form onSubmit={handleCreateModel} className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Flagship Phone Model</h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Target Series / Brand *
              </label>
              <select
                value={seriesId}
                onChange={(e) => setSeriesId(e.target.value)}
                className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                {brands.map((b) =>
                  b.series.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {b.name} ➔ {s.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <Input
              label="Phone Model Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. iPhone 17 Pro Max or Samsung Galaxy S26 Ultra"
            />

            <Input
              label="Release Year"
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="2026"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" size="sm" isLoading={isSubmitting}>
                Save Phone Model
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* MODELS TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="p-4">Phone Model</th>
              <th className="p-4">Brand & Series</th>
              <th className="p-4">Release Year</th>
              <th className="p-4">Linked Cases</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  Loading phone models...
                </td>
              </tr>
            ) : models.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No phone models created yet.
                </td>
              </tr>
            ) : (
              models.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-brand-400" />
                    <span>{m.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-zinc-300">{m.series?.brand?.name}</span>
                    <span className="text-zinc-500"> • {m.series?.name}</span>
                  </td>
                  <td className="p-4 font-semibold text-zinc-400">{m.releaseYear || "N/A"}</td>
                  <td className="p-4 font-bold text-brand-400">{m._count?.products || 0} Products</td>
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

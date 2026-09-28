"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Plus, Search, ShieldCheck, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBDT } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()) ||
      p.phoneModel?.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Manage flagship smartphone cases, variants, prices & MagSafe toggles</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="accent" size="md" className="font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add New Case Product
          </Button>
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center">
        <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter products by SKU, case name, or phone model..."
          className="w-full bg-transparent border-none text-xs text-white placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="p-4">Product Image</th>
              <th className="p-4">Case Title & SKU</th>
              <th className="p-4">Compatible Model</th>
              <th className="p-4">Base Price</th>
              <th className="p-4">Stock Count</th>
              <th className="p-4">MagSafe</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
                const thumb = p.images?.[0]?.url || "https://via.placeholder.com/60";

                return (
                  <tr key={p.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <img src={thumb} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-zinc-950 border border-zinc-800" />
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white leading-snug">{p.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">SKU: {p.sku}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-zinc-300">{p.phoneModel?.name}</span>
                      <p className="text-[10px] text-zinc-500">{p.brand?.name}</p>
                    </td>
                    <td className="p-4 font-extrabold text-white">{formatBDT(p.basePrice)}</td>
                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          totalStock > 10 ? "text-emerald-400 bg-emerald-950/60" : "text-rose-400 bg-rose-950/60"
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="p-4 font-semibold">
                      {p.magSafeCompatible ? (
                        <span className="text-brand-400 font-bold">Yes</span>
                      ) : (
                        <span className="text-zinc-600">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

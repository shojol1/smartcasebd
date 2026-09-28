"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Smartphone, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { formatBDT } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases by phone model (e.g. iPhone 17 Pro, S26 Ultra) or material..."
            className="w-full text-base bg-transparent border-none outline-none placeholder:text-zinc-400 text-zinc-900 font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-500 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="py-8 text-center text-sm text-zinc-500">Searching flagship collection...</div>
          ) : query && results.length === 0 ? (
            <div className="py-12 text-center">
              <Smartphone className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-800">No cases found for &quot;{query}&quot;</p>
              <p className="text-xs text-zinc-500 mt-1">Try searching by brand like Apple, Samsung or Pixel.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-2">
                Matching Cases ({results.length})
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                >
                  <img
                    src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=150"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg bg-zinc-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-brand-500 transition-colors truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-brand-500" />
                      <span>{product.phoneModel?.name}</span>
                      <span>•</span>
                      <span>{product.material}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-zinc-900">{formatBDT(product.basePrice)}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["iPhone 17 Pro Max", "Samsung Galaxy S26 Ultra", "Aramid Fiber Kevlar", "MagSafe Armor", "Pixel 9 Pro"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

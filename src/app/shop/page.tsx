import React from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal, ShieldCheck, Smartphone, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CASE_MATERIALS } from "@/lib/constants";

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{
    brand?: string;
    model?: string;
    material?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const selectedBrand = params.brand || "";
  const selectedModel = params.model || "";
  const selectedMaterial = params.material || "";
  const sort = params.sort || "newest";
  const query = params.q || "";

  // Fetch Brands with Series and Phone Models for filter dropdowns
  const brands = await prisma.brand.findMany({
    where: { status: true },
    include: {
      series: {
        include: {
          models: { where: { status: true }, orderBy: { sortOrder: "asc" } },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Build Prisma query filters
  const where: any = {
    status: "PUBLISHED",
  };

  if (selectedBrand) {
    where.brand = { slug: selectedBrand };
  }

  if (selectedModel) {
    where.phoneModel = { slug: selectedModel };
  }

  if (selectedMaterial) {
    where.material = selectedMaterial;
  }

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { sku: { contains: query } },
    ];
  }

  // Determine sorting order
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { basePrice: "asc" };
  if (sort === "price-high") orderBy = { basePrice: "desc" };
  if (sort === "bestseller") orderBy = { isBestseller: "desc" };

  // Fetch Products
  const products = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      phoneModel: true,
      brand: true,
      variants: true,
    },
    orderBy,
  });

  // Find active phone model name for banner badge
  let activeModelName = "";
  if (selectedModel) {
    for (const b of brands) {
      for (const s of b.series) {
        const m = s.models.find((mod) => mod.slug === selectedModel);
        if (m) {
          activeModelName = m.name;
          break;
        }
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner & Breadcrumbs */}
      <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-10 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Flagship Fit</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {activeModelName ? `Cases for ${activeModelName}` : "All Flagship Smartphone Cases"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Filtered collection of aerospace Kevlar, MagSafe armor, and luxury leather protective gear.
          </p>
        </div>

        {/* Selected Model Compatibility Badge */}
        {activeModelName && (
          <div className="z-10 bg-brand-500/20 border border-brand-500/40 p-3 rounded-xl flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-brand-400" />
            <div>
              <p className="text-[10px] text-brand-300 uppercase font-bold">Active Compatibility</p>
              <p className="text-sm font-bold text-white">{activeModelName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid & Filters Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTER */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-zinc-200 h-fit sticky top-24">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-500" /> Filter Cases
            </h3>
            {(selectedBrand || selectedModel || selectedMaterial) && (
              <Link href="/shop" className="text-xs font-semibold text-rose-600 hover:underline">
                Reset All
              </Link>
            )}
          </div>

          {/* Filter by Phone Brand */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Brand</h4>
            <div className="space-y-1">
              <Link
                href={`/shop${selectedModel ? `?model=${selectedModel}` : ""}`}
                className={`block text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                  !selectedBrand ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                All Brands
              </Link>
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={`/shop?brand=${b.slug}${selectedModel ? `&model=${selectedModel}` : ""}`}
                  className={`block text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedBrand === b.slug ? "bg-black text-white font-bold" : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Filter by Specific Phone Model */}
          <div className="space-y-2 pt-4 border-t border-zinc-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Compatible Phone Model</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {brands
                .filter((b) => !selectedBrand || b.slug === selectedBrand)
                .map((b) => (
                  <div key={b.id} className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{b.name}</span>
                    {b.series.map((s) => (
                      <div key={s.id} className="pl-1 space-y-1">
                        {s.models.map((m) => (
                          <Link
                            key={m.id}
                            href={`/shop?brand=${b.slug}&model=${m.slug}`}
                            className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                              selectedModel === m.slug
                                ? "bg-brand-50 text-brand-900 border border-brand-300 font-bold"
                                : "text-zinc-600 hover:bg-zinc-100"
                            }`}
                          >
                            <span>{m.name}</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>

          {/* Filter by Material */}
          <div className="space-y-2 pt-4 border-t border-zinc-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Material</h4>
            <div className="space-y-1">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(selectedBrand && { brand: selectedBrand }),
                  ...(selectedModel && { model: selectedModel }),
                }).toString()}`}
                className={`block text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                  !selectedMaterial ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                All Materials
              </Link>
              {CASE_MATERIALS.map((mat) => (
                <Link
                  key={mat}
                  href={`/shop?${new URLSearchParams({
                    ...(selectedBrand && { brand: selectedBrand }),
                    ...(selectedModel && { model: selectedModel }),
                    material: mat,
                  }).toString()}`}
                  className={`block text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedMaterial === mat ? "bg-black text-white font-bold" : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {mat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT GRID & MOBILE CONTROLS AREA */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Pills Bar & Sorting dropdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500">Showing {products.length} Products</span>

              {selectedBrand && (
                <span className="inline-flex items-center gap-1 text-xs bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full font-semibold">
                  Brand: {selectedBrand}
                  <Link href={`/shop?${new URLSearchParams({ ...(selectedModel && { model: selectedModel }) }).toString()}`}>
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </Link>
                </span>
              )}

              {selectedModel && (
                <span className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-900 border border-brand-200 px-2.5 py-1 rounded-full font-bold">
                  Model: {activeModelName || selectedModel}
                  <Link href={`/shop?${new URLSearchParams({ ...(selectedBrand && { brand: selectedBrand }) }).toString()}`}>
                    <X className="w-3 h-3 text-brand-600 hover:text-black" />
                  </Link>
                </span>
              )}

              {selectedMaterial && (
                <span className="inline-flex items-center gap-1 text-xs bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full font-semibold">
                  Material: {selectedMaterial}
                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(selectedBrand && { brand: selectedBrand }),
                      ...(selectedModel && { model: selectedModel }),
                    }).toString()}`}
                  >
                    <X className="w-3 h-3 text-zinc-500 hover:text-black" />
                  </Link>
                </span>
              )}
            </div>

            {/* Sorting control */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-zinc-500 shrink-0">Sort By:</span>
              <select
                defaultValue={sort}
                className="text-xs font-semibold bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-black"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="bestseller">Bestseller Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-zinc-200">
              <Smartphone className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800">No cases found matching your filters</h3>
              <p className="text-xs text-zinc-500 mt-1 mb-6">Try resetting filters or selecting a different phone model.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-xs font-bold"
              >
                View All Flagship Cases
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

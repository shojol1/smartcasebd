import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, ArrowRight, Smartphone, Star, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/Button";

export const revalidate = 60; // ISR revalidate every 60 seconds

export default async function HomePage() {
  // Fetch Brands, Bestsellers, New Arrivals, and Categories from Prisma DB
  let brands: any[] = [];
  let bestsellers: any[] = [];
  let newArrivals: any[] = [];
  let categories: any[] = [];

  try {
    [brands, bestsellers, newArrivals, categories] = await Promise.all([
      prisma.brand.findMany({
        where: { status: true },
        include: {
          series: {
            include: {
              models: { where: { status: true }, take: 4 },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED", isBestseller: true },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          phoneModel: true,
          variants: true,
        },
        take: 8,
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED", isNewArrival: true },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          phoneModel: true,
          variants: true,
        },
        take: 8,
      }),
      prisma.category.findMany({
        where: { status: true },
        take: 4,
      }),
    ]);
  } catch (err) {
    console.error("Error fetching homepage data:", err);
  }

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-black text-white py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-semibold text-brand-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Protection for iPhone 17 & Galaxy S26</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                PREMIUM CASES FOR <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-brand-500 to-amber-200">
                  FLAGSHIP PHONES
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Aerospace-grade Kevlar, MagSafe heavy armor, and handcrafted leather cases designed with zero compromise on aesthetics or camera protection.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/shop">
                  <Button variant="accent" size="lg" className="group">
                    <span>Shop Flagship Cases</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/shop?brand=apple">
                  <Button variant="outline" size="lg" className="border-zinc-700 text-white bg-zinc-900 hover:bg-zinc-800">
                    Explore iPhone Series
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  100% Fit Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  Fast Shipping Across BD
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900/60 p-4">
                <img
                  src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80"
                  alt="SMARTCASEBD Flagship Protection"
                  className="w-full h-full object-cover rounded-2xl shadow-inner"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-zinc-700/80 text-white flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Carbon Shield MagSafe</h4>
                    <p className="text-xs text-zinc-400">1500D Real Aramid Kevlar</p>
                  </div>
                  <span className="font-extrabold text-brand-400 text-sm">৳2,450</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY PHONE BRAND GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Shop By Phone Brand</h2>
            <p className="text-sm text-zinc-500 mt-1">Select your phone manufacturer for compatible luxury protection</p>
          </div>
          <Link href="/shop" className="text-sm font-bold text-brand-600 hover:text-black flex items-center gap-1">
            <span>View All Brands</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/shop?brand=${b.slug}`}
              className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-premium transition-all duration-300 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 p-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src={b.logo || ""} alt={b.name} className="w-10 h-10 object-contain rounded-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">
                  {b.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {b.series?.reduce((acc: number, s: any) => acc + (s.models?.length || 0), 0) || 0} Flagship Models
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR FLAGSHIP MODELS QUICK BAR */}
      <section className="bg-zinc-100 py-10 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Popular Flagship Models</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "iPhone 17 Pro Max", slug: "iphone-17-pro-max" },
              { name: "iPhone 17 Pro", slug: "iphone-17-pro" },
              { name: "Samsung Galaxy S26 Ultra", slug: "galaxy-s26-ultra" },
              { name: "Google Pixel 9 Pro XL", slug: "pixel-9-pro-xl" },
              { name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max" },
              { name: "Samsung Galaxy Z Fold 7", slug: "galaxy-z-fold-7" },
              { name: "OnePlus 13", slug: "oneplus-13" },
            ].map((m) => (
              <Link
                key={m.slug}
                href={`/shop?model=${m.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-300 text-xs font-bold text-zinc-800 hover:bg-black hover:text-white hover:border-black transition-all shadow-xs"
              >
                <Smartphone className="w-3.5 h-3.5 text-brand-500" />
                <span>{m.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLING CASES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" /> Top Customer Choices
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Best Selling Phone Cases</h2>
          </div>
          <Link href="/shop" className="text-sm font-bold text-zinc-700 hover:text-black flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Fresh Additions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">New Arrival Accessories</h2>
          </div>
          <Link href="/shop" className="text-sm font-bold text-zinc-700 hover:text-black flex items-center gap-1">
            <span>View Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* WHY SMARTCASEBD TRUST SECTION */}
      <section className="bg-zinc-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black tracking-tight">WHY SMARTCASEBD?</h2>
            <p className="text-sm text-zinc-400 mt-2">
              We specialize exclusively in high-grade protective & aesthetic smartphone cases for premium flagships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-zinc-800/60 border border-zinc-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">100% Fit & Camera Protection</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every case in our store undergoes strict dimensional audit to match camera bump cutouts and button tactile feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-800/60 border border-zinc-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Express Bangladesh Delivery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Orders inside Dhaka delivered within 24-48 hours. Nationwide courier delivery within 2-4 business days.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-800/60 border border-zinc-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Aerospace Kevlar & MagSafe</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We import verified 1500D Kevlar fiber and N52 neodymium magnet cases directly for high-end devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">What Our Customers Say</h2>
          <p className="text-sm text-zinc-500 mt-1">Verified buyers across Bangladesh share their experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Tanvir Ahmed",
              location: "Dhaka",
              model: "iPhone 17 Pro Max",
              review: "The Carbon Shield Kevlar case fits my iPhone 17 Pro Max like a glove. MagSafe holding force is super strong on my car mount!",
              rating: 5,
            },
            {
              name: "Subrata Chowdhury",
              location: "Chattogram",
              model: "Samsung Galaxy S26 Ultra",
              review: "Received the Apex Armor case in 3 days in Chattogram. Quality is unbelievable for the price. Highly recommended!",
              rating: 5,
            },
            {
              name: "Rafiqul Islam",
              location: "Sylhet",
              model: "Google Pixel 9 Pro",
              review: "Anti-yellowing clarity case looks fantastic. Shows off my Pixel color without adding bulky weight.",
              rating: 5,
            },
          ].map((r, index) => (
            <div key={index} className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-card">
              <div className="flex text-amber-400">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed italic">&quot;{r.review}&quot;</p>
              <div className="pt-2 border-t border-zinc-100 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-zinc-900">{r.name}</h4>
                  <p className="text-zinc-400 text-[10px]">{r.location}</p>
                </div>
                <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-[10px]">
                  {r.model}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

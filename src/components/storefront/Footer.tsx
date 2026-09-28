import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Lock, PhoneCall, Mail, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-brand-black text-zinc-300 border-t border-zinc-800">
      {/* Bangladesh Trust Value Proposition Banner */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <ShieldCheck className="w-8 h-8 text-brand-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">100% Fit Guarantee</h4>
              <p className="text-xs text-zinc-400">Custom tailored for flagship phone models</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <Truck className="w-8 h-8 text-brand-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Fast BD Shipping</h4>
              <p className="text-xs text-zinc-400">Dhaka in 24-48h, Nationwide in 2-4 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <RotateCcw className="w-8 h-8 text-brand-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Replacement</h4>
              <p className="text-xs text-zinc-400">Hassle-free exchange policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <Lock className="w-8 h-8 text-brand-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-xs text-zinc-400">Pay safely upon inspecting order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Overview Column */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-base">
              S
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              SMARTCASE<span className="text-brand-500">BD</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            {SITE_CONFIG.description} Dedicated to delivering aerospace Kevlar, MagSafe armor, and premium leather accessories with precision device compatibility.
          </p>
          <div className="space-y-2 pt-2 text-xs text-zinc-400">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{SITE_CONFIG.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-brand-400 shrink-0" />
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-white transition-colors">
                {SITE_CONFIG.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-400 shrink-0" />
              <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors">
                {SITE_CONFIG.email}
              </a>
            </p>
          </div>
        </div>

        {/* Shop Brands Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Flagship Brands</h4>
          <ul className="space-y-2 text-xs text-zinc-400 font-medium">
            <li>
              <Link href="/shop?brand=apple" className="hover:text-white transition-colors">
                Apple iPhone Cases
              </Link>
            </li>
            <li>
              <Link href="/shop?brand=samsung" className="hover:text-white transition-colors">
                Samsung Galaxy Cases
              </Link>
            </li>
            <li>
              <Link href="/shop?brand=google-pixel" className="hover:text-white transition-colors">
                Google Pixel Cases
              </Link>
            </li>
            <li>
              <Link href="/shop?brand=oneplus" className="hover:text-white transition-colors">
                OnePlus Flagships
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</h4>
          <ul className="space-y-2 text-xs text-zinc-400 font-medium">
            <li>
              <Link href="/track-order" className="hover:text-white transition-colors">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                All Products Catalog
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white transition-colors">
                My Account
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-white transition-colors">
                My Wishlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Policies & Info</h4>
          <ul className="space-y-2 text-xs text-zinc-400 font-medium">
            <li>
              <span className="hover:text-white cursor-pointer">Shipping & Delivery Policy</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">7-Day Replacement Policy</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
            </li>
            <li className="pt-2">
              <Link href="/admin/login" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                Admin Management Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-zinc-800 py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} SMARTCASEBD. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400 font-semibold">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>bKash Ready</span>
            <span>•</span>
            <span>Nagad Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

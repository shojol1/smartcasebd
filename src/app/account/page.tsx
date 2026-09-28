"use client";

import React from "react";
import Link from "next/link";
import { User, Package, Heart, LogOut, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CustomerAccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Customer Account Portal</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage your shipping address, track orders, and view saved cases</p>
        </div>
        <Link href="/login">
          <Button variant="outline" size="sm">
            Sign In / Register
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/track-order" className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Track Order Status</h3>
          <p className="text-xs text-zinc-500">View real-time package delivery progress by Order ID & Phone.</p>
        </Link>

        <Link href="/wishlist" className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Saved Wishlist</h3>
          <p className="text-xs text-zinc-500">Quickly review your bookmarked flagship cases.</p>
        </Link>

        <Link href="/shop" className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Flagship Guarantee</h3>
          <p className="text-xs text-zinc-500">Read about our 100% precise device fit guarantee policy.</p>
        </Link>
      </div>
    </div>
  );
}

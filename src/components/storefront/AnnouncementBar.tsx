import React from "react";
import { Truck, ShieldCheck, PhoneCall } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-black text-zinc-300 text-xs py-2 px-4 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-brand-400">
            <Truck className="w-3.5 h-3.5" />
            <span>Free Delivery across Bangladesh on orders over ৳2,500</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Precise Device Fit Guarantee</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-zinc-400">
          <a href={`tel:${SITE_CONFIG.phone}`} className="flex items-center gap-1 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-brand-400" />
            <span>{SITE_CONFIG.phone}</span>
          </a>
          <span>|</span>
          <span>Cash on Delivery Available</span>
        </div>
      </div>
    </div>
  );
}

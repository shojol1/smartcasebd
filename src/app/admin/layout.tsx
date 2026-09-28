"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Smartphone,
  Layers,
  ShoppingBag,
  Warehouse,
  Users,
  Tag,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Skip layout wrapper for /admin/login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Phone Brands", href: "/admin/brands", icon: Layers },
    { label: "Phone Models", href: "/admin/models", icon: Smartphone },
    { label: "Inventory & Audit", href: "/admin/inventory", icon: Warehouse },
    { label: "Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Customers", href: "/admin/customers", icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Admin logged out");
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col bg-zinc-900 border-r border-zinc-800 shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-base">
              S
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              SMARTCASE<span className="text-brand-500">BD</span>
            </span>
          </Link>
          <span className="text-[10px] font-bold bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded border border-brand-500/30">
            ADMIN
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-500 text-white font-bold shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link href="/" target="_blank" className="block text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5">
            ↗ Open Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-semibold hidden sm:inline-block">Operations Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">Super Admin</p>
              <p className="text-[10px] text-zinc-400">admin@smartcasebd.com</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
              SA
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X, Smartphone, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { SearchModal } from "./SearchModal";
import { CartDrawer } from "./CartDrawer";
import { SITE_CONFIG } from "@/lib/constants";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const { productIds } = useWishlistStore();

  const totalCartItems = getTotalItems();
  const wishlistCount = productIds.length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-brand-black flex items-center justify-center text-white font-black text-lg tracking-tighter group-hover:scale-105 transition-transform shadow-sm">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 leading-tight">
                  SMARTCASE<span className="text-brand-500">BD</span>
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest hidden sm:inline-block">
                  Flagship Smartphone Accessories
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-zinc-700">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <Link href="/shop" className="hover:text-black transition-colors flex items-center gap-1">
                <span>Shop Cases</span>
              </Link>
              <Link href="/shop?brand=apple" className="hover:text-black transition-colors">
                Apple iPhone
              </Link>
              <Link href="/shop?brand=samsung" className="hover:text-black transition-colors">
                Samsung Galaxy
              </Link>
              <Link href="/shop?brand=google-pixel" className="hover:text-black transition-colors">
                Google Pixel
              </Link>
              <Link href="/track-order" className="hover:text-black transition-colors font-semibold text-brand-600">
                Track Order
              </Link>
            </nav>

            {/* Header Right Action Tools */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-2"
                aria-label="Search cases"
              >
                <Search className="w-5 h-5" />
                <span className="text-xs text-zinc-400 font-medium hidden md:inline-block pr-1">Search model...</span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => toggleCart(true)}
                className="p-2.5 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors relative flex items-center gap-1.5"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="w-5 h-5 bg-brand-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="p-2.5 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-4 pb-6 space-y-4 animate-fade-in">
            <div className="flex flex-col space-y-3 font-medium text-base text-zinc-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-brand-500">
                Home
              </Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-1 hover:text-brand-500">
                All Cases Collection
              </Link>
              <div className="pt-2 border-t border-zinc-100 font-semibold text-xs text-zinc-400 uppercase tracking-wider">
                Shop By Phone Brand
              </div>
              <Link href="/shop?brand=apple" onClick={() => setIsMobileMenuOpen(false)} className="py-1 pl-2">
                Apple iPhone Cases
              </Link>
              <Link href="/shop?brand=samsung" onClick={() => setIsMobileMenuOpen(false)} className="py-1 pl-2">
                Samsung Galaxy Cases
              </Link>
              <Link href="/shop?brand=google-pixel" onClick={() => setIsMobileMenuOpen(false)} className="py-1 pl-2">
                Google Pixel Cases
              </Link>
              <Link href="/shop?brand=oneplus" onClick={() => setIsMobileMenuOpen(false)} className="py-1 pl-2">
                OnePlus Flagships
              </Link>
              <div className="pt-2 border-t border-zinc-100 flex flex-col space-y-2">
                <Link
                  href="/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-brand-600 font-semibold flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" /> Track Order Status
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-zinc-700 font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Customer Account / Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

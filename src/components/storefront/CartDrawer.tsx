"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG, DELIVERY_RATES } from "@/lib/constants";

export function CartDrawer() {
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState<"INSIDE" | "OUTSIDE">("INSIDE");

  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= SITE_CONFIG.freeShippingThreshold
    ? 0
    : deliveryArea === "INSIDE"
    ? DELIVERY_RATES.INSIDE_DHAKA
    : DELIVERY_RATES.OUTSIDE_DHAKA;

  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Free shipping progress logic
  const remainingForFreeShipping = Math.max(0, SITE_CONFIG.freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / SITE_CONFIG.freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const res = await fetch("/api/coupons/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCoupon, cartTotal: subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon code");
      } else {
        applyCoupon(data.code, data.discountAmount);
        setCouponSuccess(`Coupon ${data.code} applied! Saved ${formatBDT(data.discountAmount)}`);
        setInputCoupon("");
      }
    } catch {
      setCouponError("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => toggleCart(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-up">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="text-base font-bold text-zinc-900">Your Shopping Cart ({items.length})</h2>
            </div>
            <button
              onClick={() => toggleCart(false)}
              className="p-2 rounded-full hover:bg-zinc-200 text-zinc-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-brand-50 px-6 py-3 border-b border-brand-100">
            <div className="flex justify-between items-center text-xs font-semibold text-brand-900 mb-1.5">
              <span>
                {subtotal >= SITE_CONFIG.freeShippingThreshold ? (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck className="w-4 h-4" /> You unlocked FREE Delivery across BD!
                  </span>
                ) : (
                  `Add ${formatBDT(remainingForFreeShipping)} more for FREE Delivery`
                )}
              </span>
              <span>{Math.round(freeShippingPercent)}%</span>
            </div>
            <div className="w-full bg-brand-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-base font-semibold text-zinc-800">Your cart is empty</p>
                <p className="text-xs text-zinc-500 mt-1 mb-6">Discover flagship phone cases with precise compatibility.</p>
                <Button onClick={() => toggleCart(false)} variant="primary" size="md">
                  Shop Flagship Cases
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-zinc-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-zinc-900 line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Model: <span className="font-semibold text-zinc-700">{item.modelName}</span>
                    </p>
                    <p className="text-xs text-zinc-500">Color: {item.colorName}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 text-zinc-600 hover:text-black"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-zinc-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 text-zinc-600 hover:text-black"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-zinc-900">{formatBDT(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-zinc-50/80 space-y-4">
              {/* Delivery Zone Toggle */}
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-zinc-200">
                <span className="font-semibold text-zinc-700">Delivery Location:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setDeliveryArea("INSIDE")}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      deliveryArea === "INSIDE" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    Dhaka (৳60)
                  </button>
                  <button
                    onClick={() => setDeliveryArea("OUTSIDE")}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      deliveryArea === "OUTSIDE" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    Outside Dhaka (৳120)
                  </button>
                </div>
              </div>

              {/* Coupon Box */}
              {!couponCode ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      placeholder="Promo Code (e.g. WELCOME100)"
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase border border-zinc-300 rounded-lg bg-white focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  <Button type="submit" variant="secondary" size="sm" isLoading={isApplyingCoupon}>
                    Apply
                  </Button>
                </form>
              ) : (
                <div className="flex justify-between items-center text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-semibold">Coupon &apos;{couponCode}&apos; Applied (-{formatBDT(discountAmount)})</span>
                  <button onClick={removeCoupon} className="text-rose-600 hover:underline font-semibold">
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-rose-600 font-medium">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-emerald-600 font-medium">{couponSuccess}</p>}

              {/* Summary Calculation */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery Fee</span>
                  <span className="font-semibold text-zinc-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatBDT(deliveryFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatBDT(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-2 border-t border-zinc-300">
                  <span>Total Payable</span>
                  <span className="text-brand-black">{formatBDT(total)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <Link href="/checkout" onClick={() => toggleCart(false)} className="block w-full">
                <Button variant="primary" size="lg" className="w-full flex justify-between items-center group">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

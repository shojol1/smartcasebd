"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG, DELIVERY_RATES } from "@/lib/constants";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState<"INSIDE" | "OUTSIDE">("INSIDE");

  const subtotal = getSubtotal();
  const deliveryFee =
    subtotal >= SITE_CONFIG.freeShippingThreshold
      ? 0
      : deliveryArea === "INSIDE"
      ? DELIVERY_RATES.INSIDE_DHAKA
      : DELIVERY_RATES.OUTSIDE_DHAKA;

  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    setIsApplying(true);
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
        setCouponSuccess(`Applied promo ${data.code}! Saved ${formatBDT(data.discountAmount)}`);
        setInputCoupon("");
      }
    } catch {
      setCouponError("Failed to apply coupon");
    } finally {
      setIsApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-900">Your Shopping Cart is Empty</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Explore our premium phone cases for iPhone 17, Galaxy S26, Pixel 9, and flagship devices.
        </p>
        <Link href="/shop" className="inline-block pt-2">
          <Button variant="primary" size="lg">
            Browse Flagship Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Shopping Cart</h1>
          <p className="text-xs text-zinc-500 mt-1">Review items and calculate delivery rates across Bangladesh</p>
        </div>
        <button onClick={clearCart} className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items Table (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-2xl bg-white overflow-hidden">
            {items.map((item) => (
              <div key={item.variantId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-zinc-50 shrink-0" />

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 leading-snug">{item.name}</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                    <span>Device: <strong className="text-zinc-800">{item.modelName}</strong></span>
                  </p>
                  <p className="text-xs text-zinc-500">Color: {item.colorName}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <p className="text-base font-extrabold text-zinc-900">{formatBDT(item.price * item.quantity)}</p>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-zinc-300 rounded-lg bg-zinc-50">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1.5 text-zinc-600 hover:text-black"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-zinc-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1.5 text-zinc-600 hover:text-black"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black pt-2">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">Order Summary</h3>

            {/* Delivery Location Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Delivery Region</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setDeliveryArea("INSIDE")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    deliveryArea === "INSIDE"
                      ? "border-black bg-black text-white shadow-xs"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Inside Dhaka (৳60)
                </button>
                <button
                  onClick={() => setDeliveryArea("OUTSIDE")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    deliveryArea === "OUTSIDE"
                      ? "border-black bg-black text-white shadow-xs"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Outside Dhaka (৳120)
                </button>
              </div>
            </div>

            {/* Promo Coupon Form */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Promo Code</label>
              {!couponCode ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME100"
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase border border-zinc-300 rounded-xl font-semibold bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <Button type="submit" variant="secondary" size="sm" isLoading={isApplying}>
                    Apply
                  </Button>
                </form>
              ) : (
                <div className="flex justify-between items-center text-xs bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 font-semibold">
                  <span>Code &apos;{couponCode}&apos; Applied (-{formatBDT(discountAmount)})</span>
                  <button onClick={removeCoupon} className="text-rose-600 hover:underline">
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-rose-600 font-medium">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-emerald-600 font-medium">{couponSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-zinc-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatBDT(deliveryFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-{formatBDT(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-zinc-900 pt-3 border-t border-zinc-200">
                <span>Total Payable</span>
                <span>{formatBDT(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" className="block">
              <Button variant="accent" size="lg" className="w-full flex justify-between items-center font-bold">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Lock, Phone, MapPin, Tag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatBDT, isValidBDPhone } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BD_DIVISIONS, BD_DISTRICTS, DELIVERY_RATES, SITE_CONFIG } from "@/lib/constants";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, couponCode, discountAmount, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "",
    streetAddress: "",
    deliveryNote: "",
    paymentMethod: "COD" as "COD" | "BKASH" | "NAGAD" | "CARD",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto update districts when division changes
  const availableDistricts = BD_DISTRICTS[formData.division] || [];

  useEffect(() => {
    if (availableDistricts.length > 0 && !availableDistricts.includes(formData.district)) {
      setFormData((prev) => ({ ...prev, district: availableDistricts[0] }));
    }
  }, [formData.division, availableDistricts, formData.district]);

  const subtotal = getSubtotal();
  const deliveryFee =
    subtotal >= SITE_CONFIG.freeShippingThreshold
      ? 0
      : formData.division.toLowerCase() === "dhaka"
      ? DELIVERY_RATES.INSIDE_DHAKA
      : DELIVERY_RATES.OUTSIDE_DHAKA;

  const totalPayable = Math.max(0, subtotal + deliveryFee - discountAmount);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-zinc-900">Your Cart is Empty</h1>
        <p className="text-xs text-zinc-500">Add phone cases to your cart before proceeding to checkout.</p>
        <Button onClick={() => router.push("/shop")} variant="primary" size="md">
          Return to Shop
        </Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) newErrors.customerName = "Full name is required";
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!isValidBDPhone(formData.customerPhone)) {
      newErrors.customerPhone = "Enter valid 11-digit BD phone number (e.g. 01712345678)";
    }
    if (!formData.upazila.trim()) newErrors.upazila = "Upazila / Area is required";
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Detailed street address is required";
    } else if (formData.streetAddress.trim().length < 3) {
      newErrors.streetAddress = "Enter detailed street address (at least 3 characters)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix errors in the checkout form");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          couponCode,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        setIsSubmitting(false);
      } else {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/order-confirmation/${data.orderId}`);
      }
    } catch {
      toast.error("Network error placing order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Checkout</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Fast Cash on Delivery order placement across Bangladesh</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-bit Secure Checkout
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT FORM (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: CONTACT INFORMATION */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-zinc-100">
              <Phone className="w-4 h-4 text-brand-500" /> 1. Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. Tanvir Ahmed"
                error={errors.customerName}
              />
              <Input
                label="BD Phone Number *"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="e.g. 01700000000"
                error={errors.customerPhone}
                helperText="Required for delivery confirmation SMS"
              />
            </div>

            <Input
              label="Email Address (Optional)"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="e.g. tanvir@example.com"
              helperText="Digital invoice will be sent if provided"
            />
          </div>

          {/* STEP 2: SHIPPING ADDRESS */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-zinc-100">
              <MapPin className="w-4 h-4 text-brand-500" /> 2. Delivery Address (Bangladesh)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Division *
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-black focus:outline-none"
                >
                  {BD_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div} Division
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-black focus:outline-none"
                >
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Upazila / Area / Thana *"
              name="upazila"
              value={formData.upazila}
              onChange={handleChange}
              placeholder="e.g. Uttara / Dhanmondi / Mirpur / Gulshan"
              error={errors.upazila}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                Full Street Address *
              </label>
              <textarea
                name="streetAddress"
                rows={2}
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="House No, Road No, Flat / Apartment details..."
                className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 focus:border-black focus:outline-none"
              />
              {errors.streetAddress && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.streetAddress}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                Delivery Note (Optional)
              </label>
              <input
                type="text"
                name="deliveryNote"
                value={formData.deliveryNote}
                onChange={handleChange}
                placeholder="e.g. Deliver after 4:00 PM or leave with security"
                className="w-full h-11 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-zinc-100">
              <Lock className="w-4 h-4 text-brand-500" /> 3. Payment Method
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-brand-500 bg-brand-50/50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === "COD"}
                  onChange={() => setFormData((prev) => ({ ...prev, paymentMethod: "COD" }))}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <span>Cash on Delivery (COD)</span>
                    <span className="text-[10px] bg-brand-500 text-white font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
                  </p>
                  <p className="text-xs text-zinc-500">Pay cash directly to courier agent after inspecting package fit.</p>
                </div>
              </label>

              <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 opacity-80 text-xs text-zinc-600 flex justify-between items-center">
                <span>bKash / Nagad / Visa / Mastercard</span>
                <span className="font-semibold text-zinc-700 bg-zinc-200/80 px-2 py-0.5 rounded">Pay on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT ORDER SUMMARY (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-6 shadow-sm sticky top-24">
            <h3 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">Order Summary ({items.length})</h3>

            {/* Cart Item Cards */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-white shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-zinc-500">
                      Model: <span className="font-semibold text-zinc-700">{item.modelName}</span>
                    </p>
                    <p className="text-[11px] text-zinc-500">Qty: {item.quantity} x {formatBDT(item.price)}</p>
                  </div>
                  <span className="text-xs font-extrabold text-zinc-900 shrink-0">{formatBDT(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee ({formData.division})</span>
                <span className="font-bold text-zinc-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatBDT(deliveryFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount ({couponCode})</span>
                  <span>-{formatBDT(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-zinc-900 pt-3 border-t border-zinc-200">
                <span>Total Payable (COD)</span>
                <span className="text-brand-black">{formatBDT(totalPayable)}</span>
              </div>
            </div>

            {/* Submission CTA */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-md flex justify-between items-center"
            >
              <span>Place Order (Cash on Delivery)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="text-center text-[11px] text-zinc-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Precise Device Compatibility Guarantee</span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

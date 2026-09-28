"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, CheckCircle2 } from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Please provide both Order Number and Phone Number");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId && initialPhone) {
      handleTrack();
    }
  }, [initialOrderId, initialPhone]);

  const steps = [
    { key: "PENDING", label: "Order Received" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "PACKED", label: "Packed" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const currentStepIndex = order ? steps.findIndex((s) => s.key === order.orderStatus) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto">
          <Package className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Track Your Package</h1>
        <p className="text-xs text-zinc-500">Enter your Order ID & Phone number to get real-time status updates.</p>
      </div>

      {/* TRACKING FORM */}
      <form onSubmit={handleTrack} className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm space-y-4 max-w-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Order Number *"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. SCBD-2026-8942"
          />
          <Input
            label="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 01700000000"
          />
        </div>

        {error && <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">{error}</p>}

        <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full font-bold">
          <Search className="w-4 h-4 mr-2" /> Track Order
        </Button>
      </form>

      {/* ORDER PROGRESS TIMELINE */}
      {order && (
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white space-y-8 animate-fade-in shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-100 gap-2">
            <div>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">Order ID</span>
              <h2 className="text-lg font-black text-zinc-900">{order.orderNumber}</h2>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">Current Status</span>
              <span className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 inline-block mt-0.5">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* STEP PROGRESS BAR */}
          <div className="py-4">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? "bg-brand-black text-white"
                          : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                      } ${isCurrent ? "ring-4 ring-brand-500/20 scale-110" : ""}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4 text-brand-400" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-semibold ${isPassed ? "text-zinc-900" : "text-zinc-400"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ITEMS SUMMARY */}
          <div className="pt-4 border-t border-zinc-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Order Package Items</h4>
            <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-3 flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-zinc-900">{item.productName}</h5>
                    <p className="text-zinc-500">Model: {item.modelName} | Color: {item.colorName}</p>
                  </div>
                  <span className="font-bold text-zinc-900">{formatBDT(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right text-sm font-extrabold text-zinc-900">
              Total Payable (COD): {formatBDT(order.total)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-zinc-500">Loading Order Tracking...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

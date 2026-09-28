import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Truck, ArrowRight, PhoneCall, Copy, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/utils";
import { ORDER_STATUS_MAP, SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export const revalidate = 0;

interface OrderConfirmationPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const statusConfig = ORDER_STATUS_MAP[order.orderStatus] || ORDER_STATUS_MAP.PENDING;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* SUCCESS HERO BANNER */}
      <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 text-center space-y-4 relative overflow-hidden shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Order Placed Successfully!</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Thank you for choosing SMARTCASEBD. Your flagship case order has been received.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-xl text-sm font-bold text-brand-400 mt-2">
          <span>Order Number:</span>
          <span className="text-white select-all">{order.orderNumber}</span>
        </div>
      </div>

      {/* ORDER DETAILS CARD */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-100">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Status</span>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mt-1 ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Payment</span>
            <span className="text-sm font-extrabold text-zinc-900">{order.paymentMethod} (Cash on Delivery)</span>
          </div>
        </div>

        {/* ITEMS LIST */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Ordered Items</h3>
          <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-3.5 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-zinc-900">{item.productName}</h4>
                  <p className="text-zinc-500 mt-0.5">
                    Model: <strong className="text-zinc-700">{item.modelName}</strong> | Color: {item.colorName}
                  </p>
                  <p className="text-zinc-400">Qty: {item.quantity} x {formatBDT(item.unitPrice)}</p>
                </div>
                <span className="font-extrabold text-zinc-900 text-sm">{formatBDT(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DELIVERY ADDRESS SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 text-xs">
          <div>
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider mb-1">Shipping Customer</h4>
            <p className="font-semibold text-zinc-800">{order.customerName}</p>
            <p className="text-zinc-600">{order.customerPhone}</p>
            {order.customerEmail && <p className="text-zinc-500">{order.customerEmail}</p>}
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider mb-1">Delivery Address</h4>
            <p className="text-zinc-700">{order.streetAddress}</p>
            <p className="text-zinc-700">{order.upazila}, {order.district}, {order.division}</p>
            {order.deliveryNote && <p className="text-zinc-500 italic mt-1">Note: &quot;{order.deliveryNote}&quot;</p>}
          </div>
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="pt-4 border-t border-zinc-200 text-xs space-y-1.5 text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-zinc-900">{formatBDT(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-bold text-zinc-900">{order.shippingCost === 0 ? "FREE" : formatBDT(order.shippingCost)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Promo Discount</span>
              <span>-{formatBDT(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-zinc-900 pt-3 border-t border-zinc-200">
            <span>Total Payable to Courier</span>
            <span className="text-brand-black">{formatBDT(order.total)}</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Link href={`/track-order?orderId=${order.orderNumber}&phone=${order.customerPhone}`}>
          <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Track Order Progress</span>
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

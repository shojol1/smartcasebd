import React from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, AlertTriangle, Smartphone, Package, ArrowRight, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Aggregate DB stats
  const [totalOrders, pendingOrders, totalProducts, totalModels, lowStockVariants, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.phoneModel.count({ where: { status: true } }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 5 } },
        include: { product: true, phoneModel: true },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
    ]);

  // Aggregate Total Revenue
  const salesAggregate = await prisma.order.aggregate({
    _sum: { total: true },
  });
  const totalRevenue = salesAggregate._sum.total || 0;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time metrics, orders stream & inventory alerts</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors shadow-sm"
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/models"
            className="px-4 py-2 rounded-xl bg-zinc-800 text-white font-bold text-xs hover:bg-zinc-700 border border-zinc-700 transition-colors"
          >
            + Add Phone Model
          </Link>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{formatBDT(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Lifetime gross revenue
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalOrders}</p>
          <p className="text-[11px] text-amber-400 font-semibold">{pendingOrders} pending confirmation</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white">{lowStockVariants.length}</p>
          <p className="text-[11px] text-rose-400 font-semibold">Variants with &le; 5 units</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Phone Models</span>
            <Smartphone className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalModels}</p>
          <p className="text-[11px] text-zinc-400 font-medium">Across Apple, Samsung, Pixel</p>
        </div>
      </div>

      {/* RECENT ORDERS & LOW STOCK TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 Columns) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders Stream</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-brand-400 hover:underline flex items-center gap-1">
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => {
                    const statusConfig = ORDER_STATUS_MAP[ord.orderStatus] || ORDER_STATUS_MAP.PENDING;
                    return (
                      <tr key={ord.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="p-3 font-bold text-white">{ord.orderNumber}</td>
                        <td className="p-3">
                          <p className="font-semibold text-white">{ord.customerName}</p>
                          <p className="text-[10px] text-zinc-500">{ord.customerPhone}</p>
                        </td>
                        <td className="p-3 font-semibold">{ord.items.length} items</td>
                        <td className="p-3 font-extrabold text-white">{formatBDT(ord.total)}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.bg} ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 Columns) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-4 h-4" /> Stock Alerts
            </h3>
            <Link href="/admin/inventory" className="text-xs font-bold text-zinc-400 hover:text-white">
              Inventory Log
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockVariants.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">All inventory levels healthy.</p>
            ) : (
              lowStockVariants.map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{v.product.name}</h4>
                    <p className="text-zinc-400 text-[11px]">{v.phoneModel.name} • {v.colorName}</p>
                  </div>
                  <span className="font-bold text-rose-400 bg-rose-950/60 border border-rose-900 px-2 py-0.5 rounded">
                    {v.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

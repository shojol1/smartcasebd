import React from "react";
import { Warehouse, History, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const [variants, logs] = await Promise.all([
    prisma.productVariant.findMany({
      include: {
        product: true,
        phoneModel: true,
      },
      orderBy: { stock: "asc" },
    }),
    prisma.inventoryLog.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Inventory & Audit Log Engine</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Real-time variant stock levels and audit transaction history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Variant Stock Levels (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-brand-400" /> Current Variant Stocks
          </h3>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Phone Model</th>
                  <th className="p-3">Color Variant</th>
                  <th className="p-3">Stock Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-800/50">
                    <td className="p-3 font-bold text-white">{v.product.name}</td>
                    <td className="p-3 text-zinc-400">{v.phoneModel.name}</td>
                    <td className="p-3 text-zinc-300">{v.colorName}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          v.stock <= 5 ? "bg-rose-950 text-rose-400 border border-rose-900" : "bg-emerald-950 text-emerald-400"
                        }`}
                      >
                        {v.stock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" /> Audit History Log
          </h3>

          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-xs text-zinc-500">No inventory logs recorded.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{log.product.name}</span>
                    <span className={`font-mono font-bold ${log.quantityChange > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">Reason: {log.reason}</p>
                  <p className="text-zinc-500 text-[10px]">{new Date(log.createdAt).toLocaleString("en-BD")}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

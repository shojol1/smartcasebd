"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Eye, Printer, Edit2, ShieldCheck, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBDT } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus, trackingNumber }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update order");
      } else {
        toast.success(`Order #${selectedOrder.orderNumber} updated to ${newStatus}`);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch {
      toast.error("Network error updating order");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Order Processing Hub</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Manage customer orders, update delivery statuses & assign courier tracking</p>
        </div>
      </div>

      {/* STATUS UPDATE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form onSubmit={handleUpdateStatus} className="w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Update Order #{selectedOrder.orderNumber}</h3>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1">
              <p>Customer: <strong className="text-white">{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})</p>
              <p>Delivery: {selectedOrder.streetAddress}, {selectedOrder.upazila}, {selectedOrder.district}</p>
              <p>Total Payable (COD): <strong className="text-brand-400">{formatBDT(selectedOrder.total)}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Change Order Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none font-semibold"
              >
                {Object.keys(ORDER_STATUS_MAP).map((st) => (
                  <option key={st} value={st}>
                    {ORDER_STATUS_MAP[st].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Courier Tracking ID (Steadfast/Pathao)</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. SF-9842104"
                className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" size="sm" isLoading={isUpdating}>
                Save Status Change
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ORDERS TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="p-4">Order ID & Date</th>
              <th className="p-4">Customer & Address</th>
              <th className="p-4">Items Summary</th>
              <th className="p-4">Total BDT</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((ord) => {
                const statusConfig = ORDER_STATUS_MAP[ord.orderStatus] || ORDER_STATUS_MAP.PENDING;
                return (
                  <tr key={ord.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <p className="font-extrabold text-white">{ord.orderNumber}</p>
                      <p className="text-[10px] text-zinc-500">{new Date(ord.createdAt).toLocaleDateString("en-BD")}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{ord.customerName}</p>
                      <p className="text-[11px] text-zinc-400">{ord.customerPhone}</p>
                      <p className="text-[10px] text-zinc-500">{ord.district}, {ord.division}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-zinc-300">{ord.items.length} items</p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-xs">{ord.items.map((i: any) => i.modelName).join(", ")}</p>
                    </td>
                    <td className="p-4 font-black text-white">{formatBDT(ord.total)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setNewStatus(ord.orderStatus);
                          setTrackingNumber(ord.trackingNumber || "");
                        }}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1 border border-zinc-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Manage
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

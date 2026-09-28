import React from "react";
import { Users, Phone, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Customer Database</h1>
        <p className="text-xs text-zinc-400 mt-0.5">View registered customer profiles and total order volume</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Email</th>
              <th className="p-4">Orders Placed</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No registered customer profiles found yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0);
                return (
                  <tr key={c.id} className="hover:bg-zinc-800/50">
                    <td className="p-4 font-bold text-white">{c.name}</td>
                    <td className="p-4 font-semibold text-zinc-300">{c.phone}</td>
                    <td className="p-4 text-zinc-400">{c.email || "N/A"}</td>
                    <td className="p-4 font-bold text-brand-400">{c.orders.length} Orders</td>
                    <td className="p-4 font-extrabold text-white">{formatBDT(totalSpent)}</td>
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

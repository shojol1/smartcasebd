import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderStatus, trackingNumber } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update status and optional tracking number
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus && { orderStatus: orderStatus as any }),
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(orderStatus === "DELIVERED" && { paymentStatus: "PAID" }),
      },
    });

    // If order was cancelled, return stock to inventory
    if (orderStatus === "CANCELLED" && existingOrder.orderStatus !== "CANCELLED") {
      for (const item of existingOrder.items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });

        await prisma.inventoryLog.create({
          data: {
            productId: item.variantId,
            variantId: item.variantId,
            quantityChange: item.quantity,
            previousStock: 0,
            newStock: 0,
            reason: `Order #${existingOrder.orderNumber} Cancelled - Restocked`,
          },
        });
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

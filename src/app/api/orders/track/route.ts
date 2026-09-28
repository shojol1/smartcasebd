import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber") || "";
    const phone = searchParams.get("phone") || "";

    if (!orderNumber || !phone) {
      return NextResponse.json({ error: "Order Number and Phone Number are required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.trim(),
        customerPhone: { contains: phone.trim().slice(-8) }, // Matches last 8 digits safely
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "No matching order found. Please verify Order ID and Phone." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json({ error: "Internal error tracking order" }, { status: 500 });
  }
}

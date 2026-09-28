import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;

    if (!code || typeof cartTotal !== "number") {
      return NextResponse.json({ error: "Coupon code and cart total are required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.status) {
      return NextResponse.json({ error: "Invalid or inactive promo code" }, { status: 404 });
    }

    if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }

    if (cartTotal < coupon.minOrderValue) {
      return NextResponse.json(
        { error: `Minimum cart subtotal of ৳${coupon.minOrderValue} required for this code` },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Promo code usage limit reached" }, { status: 400 });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "FIXED") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    }

    return NextResponse.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.round(discountAmount),
    });
  } catch (error) {
    console.error("Coupon verify error:", error);
    return NextResponse.json({ error: "Internal error verifying coupon" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validations";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coupons });
  } catch {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = couponSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    const { code, discountType, discountValue, minOrderValue, maxDiscountAmount, usageLimit, status } = validation.data;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType: discountType as any,
        discountValue,
        minOrderValue,
        maxDiscountAmount: maxDiscountAmount || null,
        usageLimit: usageLimit || null,
        status,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Coupon with this code already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

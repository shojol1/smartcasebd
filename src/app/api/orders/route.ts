import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { DELIVERY_RATES, SITE_CONFIG } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate form fields with Zod
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      const errorMessage = firstIssue
        ? `${firstIssue.path.length > 0 ? `${firstIssue.path.join(".")}: ` : ""}${firstIssue.message}`
        : "Validation failed";

      return NextResponse.json(
        { error: errorMessage, details: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      division,
      district,
      upazila,
      streetAddress,
      deliveryNote,
      paymentMethod,
      couponCode,
    } = validation.data;

    const { items } = body;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Fetch and verify variant stocks from DB
    const variantIds = items.map((i: any) => i.variantId);
    const dbVariants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true, phoneModel: true },
    });

    if (dbVariants.length !== items.length) {
      return NextResponse.json({ error: "One or more products are no longer available" }, { status: 400 });
    }

    let calculatedSubtotal = 0;
    const orderItemData: any[] = [];

    for (const item of items) {
      const variant = dbVariants.find((v) => v.id === item.variantId);
      if (!variant) continue;

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name} (${variant.colorName}). Only ${variant.stock} available.` },
          { status: 400 }
        );
      }

      const itemTotal = variant.price * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItemData.push({
        variantId: variant.id,
        productName: variant.product.name,
        modelName: variant.phoneModel.name,
        colorName: variant.colorName,
        unitPrice: variant.price,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // 3. Calculate delivery charges
    const shippingCost =
      calculatedSubtotal >= SITE_CONFIG.freeShippingThreshold
        ? 0
        : division.toLowerCase() === "dhaka"
        ? DELIVERY_RATES.INSIDE_DHAKA
        : DELIVERY_RATES.OUTSIDE_DHAKA;

    // 4. Verify Coupon Discount if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.status && calculatedSubtotal >= coupon.minOrderValue) {
        if (coupon.discountType === "FIXED") {
          discountAmount = coupon.discountValue;
        } else if (coupon.discountType === "PERCENTAGE") {
          discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        }
        discountAmount = Math.round(discountAmount);
      }
    }

    const totalPayable = Math.max(0, calculatedSubtotal + shippingCost - discountAmount);
    const orderNumber = generateOrderNumber();

    // 5. Execute DB Transaction (Create Order + Decrement Inventory)
    const resultOrder = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          division,
          district,
          upazila,
          streetAddress,
          deliveryNote: deliveryNote || null,
          shippingCost,
          subtotal: calculatedSubtotal,
          discount: discountAmount,
          total: totalPayable,
          paymentMethod: paymentMethod as any,
          paymentStatus: "PENDING",
          orderStatus: "PENDING",
          couponCode: couponCode || null,
          items: {
            create: orderItemData,
          },
        },
      });

      // Decrement stock & record Inventory Log
      for (const item of items) {
        const variant = dbVariants.find((v) => v.id === item.variantId)!;
        const newStock = variant.stock - item.quantity;

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: newStock },
        });

        await tx.inventoryLog.create({
          data: {
            productId: variant.productId,
            variantId: variant.id,
            quantityChange: -item.quantity,
            previousStock: variant.stock,
            newStock,
            reason: `Customer Order #${orderNumber}`,
          },
        });
      }

      // Update coupon usage count if used
      if (couponCode) {
        await tx.coupon.update({
          where: { code: couponCode.toUpperCase() },
          data: { usageCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: resultOrder.id,
      orderNumber: resultOrder.orderNumber,
      total: resultOrder.total,
    });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}

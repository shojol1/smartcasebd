import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { name: { contains: q } },
          { sku: { contains: q } },
          { material: { contains: q } },
          { phoneModel: { name: { contains: q } } },
          { brand: { name: { contains: q } } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        phoneModel: true,
        brand: true,
      },
      take: 8,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

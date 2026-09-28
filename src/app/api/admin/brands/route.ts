import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        series: {
          include: { models: true },
        },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ brands });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = brandSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    const { name, logo, description, sortOrder, status } = validation.data;
    const slug = slugify(name);

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logo: logo || null,
        description: description || null,
        sortOrder,
        status,
      },
    });

    return NextResponse.json({ success: true, brand });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Brand with this name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

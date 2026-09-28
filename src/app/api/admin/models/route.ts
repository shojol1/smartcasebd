import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { phoneModelSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const models = await prisma.phoneModel.findMany({
      include: {
        series: {
          include: { brand: true },
        },
        _count: { select: { products: true, variants: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch phone models" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = phoneModelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    const { seriesId, name, releaseYear, sortOrder, status } = validation.data;
    const slug = slugify(name);

    const phoneModel = await prisma.phoneModel.create({
      data: {
        seriesId,
        name,
        slug,
        releaseYear: releaseYear || null,
        sortOrder,
        status,
      },
    });

    return NextResponse.json({ success: true, phoneModel });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Phone model with this name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create phone model" }, { status: 500 });
  }
}

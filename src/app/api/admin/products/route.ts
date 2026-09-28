import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        phoneModel: true,
        category: true,
        variants: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    const {
      name,
      sku,
      categoryId,
      brandId,
      phoneModelId,
      description,
      shortDescription,
      basePrice,
      compareAtPrice,
      costPrice,
      status,
      isFeatured,
      isBestseller,
      isNewArrival,
      material,
      color,
      finish,
      magSafeCompatible,
      warrantyInfo,
      seoTitle,
      seoDescription,
      images,
    } = validation.data;

    const slug = slugify(name);

    // Create Product with Images & Default Variant inside a Transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.create({
        data: {
          name,
          slug,
          sku,
          categoryId,
          brandId,
          phoneModelId,
          description,
          shortDescription: shortDescription || null,
          basePrice,
          compareAtPrice: compareAtPrice || null,
          costPrice: costPrice || null,
          status: status as any,
          isFeatured,
          isBestseller,
          isNewArrival,
          material,
          color: color || "Obsidian Black",
          finish: finish || null,
          magSafeCompatible,
          warrantyInfo: warrantyInfo || "1 Year Fit Guarantee",
          seoTitle: seoTitle || `${name} | SmartCaseBD`,
          seoDescription: seoDescription || shortDescription || description.slice(0, 160),
        },
      });

      // Create Product Images
      for (let i = 0; i < images.length; i++) {
        await tx.productImage.create({
          data: {
            productId: prod.id,
            url: images[i],
            altText: `${name} Image ${i + 1}`,
            isThumbnail: i === 0,
            sortOrder: i,
          },
        });
      }

      // Create Primary Variant
      const defaultVariant = await tx.productVariant.create({
        data: {
          productId: prod.id,
          phoneModelId,
          colorName: color || "Obsidian Black",
          colorHex: "#111111",
          sku: `${sku}-DEFAULT`,
          price: basePrice,
          compareAtPrice: compareAtPrice || null,
          stock: 25, // Default stock
          image: images[0],
        },
      });

      // Log initial inventory
      await tx.inventoryLog.create({
        data: {
          productId: prod.id,
          variantId: defaultVariant.id,
          quantityChange: 25,
          previousStock: 0,
          newStock: 25,
          reason: "Initial Product Creation Restock",
        },
      });

      return prod;
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Product creation error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Product with this SKU or Name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error?.message || "Failed to create product" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

// GET single product by ID for Edit page
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        phoneModel: true,
        category: true,
        variants: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT update product by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update Product, Images and default Variant inside a Transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Update main product details
      const prod = await tx.product.update({
        where: { id },
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

      // 2. Refresh images (Delete old and recreate)
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      for (let i = 0; i < images.length; i++) {
        await tx.productImage.create({
          data: {
            productId: id,
            url: images[i],
            altText: `${name} Image ${i + 1}`,
            isThumbnail: i === 0,
            sortOrder: i,
          },
        });
      }

      // 3. Update primary variant if exists
      const firstVariant = await tx.productVariant.findFirst({
        where: { productId: id },
      });

      if (firstVariant) {
        await tx.productVariant.update({
          where: { id: firstVariant.id },
          data: {
            price: basePrice,
            compareAtPrice: compareAtPrice || null,
            image: images[0],
            phoneModelId,
          },
        });
      }

      return prod;
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}

// DELETE product by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

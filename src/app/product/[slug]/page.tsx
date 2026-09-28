import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailView } from "@/components/storefront/ProductDetailView";
import { ProductCard } from "@/components/storefront/ProductCard";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch Product with PhoneModel, Brand, Variants, Images, Reviews
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      phoneModel: true,
      brand: true,
      variants: { orderBy: { stock: "desc" } },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  // Fetch Related Products for the same Phone Model or Category
  const relatedProducts = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: product.id },
      OR: [
        { phoneModelId: product.phoneModelId },
        { categoryId: product.categoryId },
      ],
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      phoneModel: true,
      variants: true,
    },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <ProductDetailView product={product} relatedProducts={relatedProducts} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-zinc-200">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
                More Cases for {product.phoneModel?.name || "This Device"}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Explore alternate materials and armor protection</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

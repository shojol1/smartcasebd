"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ShieldCheck, Star } from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    compareAtPrice?: number | null;
    isFeatured?: boolean;
    isBestseller?: boolean;
    isNewArrival?: boolean;
    material?: string | null;
    magSafeCompatible?: boolean;
    images?: { url: string }[];
    phoneModel?: { name: string } | null;
    variants?: {
      id: string;
      colorName: string;
      colorHex?: string | null;
      price: number;
      stock: number;
      sku: string;
    }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorite = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600";
  const defaultVariant = product.variants?.[0];

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.basePrice) / product.compareAtPrice!) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || defaultVariant.stock <= 0) {
      toast.error("Item is currently out of stock");
      return;
    }

    addItem(
      {
        variantId: defaultVariant.id,
        productId: product.id,
        name: product.name,
        modelName: product.phoneModel?.name || "Flagship Device",
        colorName: defaultVariant.colorName,
        colorHex: defaultVariant.colorHex || undefined,
        image: primaryImage,
        price: defaultVariant.price || product.basePrice,
        stock: defaultVariant.stock,
        sku: defaultVariant.sku,
      },
      1
    );

    toast.success(`Added ${product.name} to cart!`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(isFavorite ? "Removed from Wishlist" : "Saved to Wishlist");
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-zinc-200/80 shadow-card hover:shadow-premium-hover hover:border-zinc-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Badges Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
          {product.isBestseller && <Badge variant="brand">Bestseller</Badge>}
          {product.isNewArrival && !product.isBestseller && <Badge variant="neutral">New Arrival</Badge>}
          {hasDiscount && (
            <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="pointer-events-auto p-2 rounded-full bg-white/90 backdrop-blur-xs text-zinc-600 hover:text-rose-500 hover:bg-white transition-all shadow-xs"
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square bg-zinc-50 overflow-hidden block">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {product.magSafeCompatible && (
          <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-brand-400" /> MagSafe
          </span>
        )}
      </Link>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Compatibility Pill */}
          {product.phoneModel && (
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-md mb-1.5">
              <ShieldCheck className="w-3 h-3 text-brand-500" />
              <span>{product.phoneModel.name}</span>
            </div>
          )}

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-zinc-900 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5 text-xs text-zinc-500 font-medium">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-zinc-400 font-semibold">(5.0)</span>
          </div>
        </div>

        {/* Footer Price & Quick Add */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-zinc-900">{formatBDT(product.basePrice)}</span>
              {hasDiscount && (
                <span className="text-xs text-zinc-400 line-through font-medium">{formatBDT(product.compareAtPrice!)}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className="p-2.5 rounded-xl bg-brand-black text-white hover:bg-black active:scale-95 transition-all shadow-xs flex items-center gap-1"
            title="Quick Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

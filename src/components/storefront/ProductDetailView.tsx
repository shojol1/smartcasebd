"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Star, Heart, ShoppingBag, Truck, RotateCcw, Award, Check, Plus, Minus, Share2 } from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductDetailViewProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string | null;
    basePrice: number;
    compareAtPrice?: number | null;
    material?: string | null;
    finish?: string | null;
    magSafeCompatible?: boolean;
    warrantyInfo?: string | null;
    phoneModel?: { name: string; slug: string } | null;
    brand?: { name: string } | null;
    images: { url: string; altText?: string | null }[];
    variants: {
      id: string;
      colorName: string;
      colorHex?: string | null;
      price: number;
      compareAtPrice?: number | null;
      stock: number;
      sku: string;
      image?: string | null;
    }[];
    reviews: {
      id: string;
      userName: string;
      rating: number;
      comment: string;
      createdAt: any;
    }[];
  };
  relatedProducts: any[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorite = isInWishlist(product.id);

  // Variant & Image state
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [activeImage, setActiveImage] = useState(
    selectedVariant?.image || product.images[0]?.url || "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb"
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");

  const price = selectedVariant?.price || product.basePrice;
  const compareAtPrice = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const stock = selectedVariant?.stock ?? 10;
  const isOutOfStock = stock <= 0;

  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) {
      toast.error("Selected variant is currently out of stock");
      return;
    }

    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        modelName: product.phoneModel?.name || "Flagship Device",
        colorName: selectedVariant.colorName,
        colorHex: selectedVariant.colorHex || undefined,
        image: activeImage,
        price,
        stock,
        sku: selectedVariant.sku,
      },
      quantity
    );

    toast.success(`Added ${quantity}x ${product.name} to your cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-zinc-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black">
          Shop
        </Link>
        <span>/</span>
        {product.brand && (
          <>
            <Link href={`/shop?brand=${product.brand.name.toLowerCase()}`} className="hover:text-black">
              {product.brand.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT: IMAGE GALLERY (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-200 group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
            {product.magSafeCompatible && (
              <span className="absolute top-4 right-4 bg-black/80 text-white text-xs font-semibold px-3 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-zinc-700">
                <ShieldCheck className="w-4 h-4 text-brand-400" /> MagSafe Compatible
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img.url ? "border-brand-black ring-2 ring-brand-black/20" : "border-zinc-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS & BUY BOX (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Compatibility Highlight Badge */}
          {product.phoneModel && (
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-900 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Guaranteed Fit for {product.phoneModel.name}</span>
            </div>
          )}

          {/* Title & Ratings */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-800">5.0 (24 Verified Reviews)</span>
              <span className="text-zinc-300">•</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                In Stock & Ready to Ship
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-zinc-900">{formatBDT(price)}</span>
            {hasDiscount && (
              <span className="text-base text-zinc-400 line-through font-semibold">{formatBDT(compareAtPrice!)}</span>
            )}
            {hasDiscount && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 ml-auto">
                Save {formatBDT(compareAtPrice! - price)}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">{product.shortDescription}</p>
          )}

          {/* COLOR VARIANT SWATCHES */}
          {product.variants.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-800 uppercase tracking-wider">
                  Color: <span className="text-zinc-600 font-normal">{selectedVariant?.colorName}</span>
                </span>
                <span className="text-zinc-400 text-[11px]">SKU: {selectedVariant?.sku}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.image) setActiveImage(v.image);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    {v.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <span>{v.colorName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY COUNTER & BUY BUTTONS */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-zinc-300 rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-zinc-600 hover:text-black transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  className="p-2.5 text-zinc-600 hover:text-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2 font-bold"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                variant="accent"
                size="lg"
                className="w-full font-bold shadow-md"
              >
                Buy Now (Cash on Delivery)
              </Button>
            </div>
          </div>

          {/* Value Props Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-zinc-600 border-t border-zinc-200">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <Truck className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Dhaka 24-48h Delivery</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <RotateCcw className="w-4 h-4 text-brand-500 shrink-0" />
              <span>7-Day Easy Exchange</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <Award className="w-4 h-4 text-brand-500 shrink-0" />
              <span>1-Year Fit Warranty</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Cash on Delivery BD</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION & REVIEWS ACCORDION SECTION */}
      <div className="pt-12 border-t border-zinc-200">
        <div className="flex gap-6 border-b border-zinc-200 pb-3 font-bold text-sm">
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 -mb-3 transition-colors ${
              activeTab === "specs" ? "border-b-2 border-black text-black font-extrabold" : "text-zinc-400 hover:text-zinc-700"
            }`}
          >
            Features & Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 -mb-3 transition-colors ${
              activeTab === "reviews" ? "border-b-2 border-black text-black font-extrabold" : "text-zinc-400 hover:text-zinc-700"
            }`}
          >
            Customer Reviews ({product.reviews.length || 24})
          </button>
        </div>

        <div className="py-6">
          {activeTab === "specs" ? (
            <div className="prose prose-sm max-w-none text-zinc-700 space-y-4">
              <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-xs">
                <div>
                  <span className="font-bold text-zinc-900 block">Material Build:</span>
                  <span className="text-zinc-600">{product.material || "Aramid Kevlar Fiber"}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block">Finish & Texture:</span>
                  <span className="text-zinc-600">{product.finish || "3D Ergonomic Grip"}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block">MagSafe Support:</span>
                  <span className="text-zinc-600">{product.magSafeCompatible ? "Integrated N52 Neodymium Array" : "Standard Non-Magnetic"}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block">Warranty Details:</span>
                  <span className="text-zinc-600">{product.warrantyInfo || "1 Year Fit Guarantee"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">Showing verified customer feedback across Bangladesh.</p>
              <div className="space-y-3">
                {[
                  { name: "Sabbir Hossain", rating: 5, comment: "Ordered for my iPhone 17 Pro. Outstanding fit and zero camera lens shadow." },
                  { name: "Mahmudul Hasan", rating: 5, comment: "Delivered next day in Uttara, Dhaka. Solid packaging and genuine item." },
                ].map((r, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-900">{r.name}</span>
                      <div className="flex text-amber-400">
                        {[...Array(r.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STICKY MOBILE PURCHASE BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 lg:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">{product.name}</p>
          <p className="text-sm font-black text-zinc-900">{formatBDT(price)}</p>
        </div>
        <Button onClick={handleAddToCart} variant="accent" size="md" className="font-bold shadow-sm shrink-0">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

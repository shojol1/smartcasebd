"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Smartphone } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchWishlistProducts = async () => {
      try {
        const res = await fetch(`/api/products/search?q=`);
        // Fetch all products and filter client-side for wishlist IDs
        const data = await res.json();
        const wishlistItems = (data.products || []).filter((p: any) => productIds.includes(p.id));
        setProducts(wishlistItems);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [productIds]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <h1 className="text-2xl font-bold">My Saved Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">My Saved Wishlist ({productIds.length})</h1>
        <p className="text-xs text-zinc-500 mt-1">Keep track of your favorite flagship phone cases and accessories</p>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-zinc-200 space-y-3">
          <Heart className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="text-base font-bold text-zinc-800">Your Wishlist is empty</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Click the heart icon on any flagship case product card to save it for later.
          </p>
          <Link
            href="/shop"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold"
          >
            Explore Flagship Cases
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

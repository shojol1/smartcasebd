import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggleWishlist: (productId) => {
        const current = get().productIds;
        if (current.includes(productId)) {
          set({ productIds: current.filter((id) => id !== productId) });
        } else {
          set({ productIds: [...current, productId] });
        }
      },
      isInWishlist: (productId) => get().productIds.includes(productId),
    }),
    {
      name: "smartcasebd_wishlist_storage",
    }
  )
);

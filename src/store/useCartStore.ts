import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  modelName: string;
  colorName: string;
  colorHex?: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  sku: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  discountAmount: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  toggleCart: (open?: boolean) => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountAmount: 0,

      addItem: (item, qty = 1) => {
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.variantId === item.variantId);

        if (existing) {
          const newQty = Math.min(existing.quantity + qty, item.stock);
          set({
            items: currentItems.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: newQty } : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: Math.min(qty, item.stock) }],
            isOpen: true,
          });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        });
      },

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      applyCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),

      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      toggleCart: (open) => set({ isOpen: open !== undefined ? open : !get().isOpen }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "smartcasebd_cart_storage",
    }
  )
);

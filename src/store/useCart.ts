import { create } from "zustand";
import { PRODUCTS, type Product } from "../data/products";

export interface CartLine {
  product: Product;
  qty: number;
}

interface CartState {
  items: Record<string, number>; // productId -> qty
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  lines: () => CartLine[];
  count: () => number;
  total: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: {},
  add: (id) => set((s) => ({ items: { ...s.items, [id]: (s.items[id] ?? 0) + 1 } })),
  remove: (id) =>
    set((s) => {
      const next = { ...s.items };
      const q = (next[id] ?? 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return { items: next };
    }),
  setQty: (id, qty) =>
    set((s) => {
      const next = { ...s.items };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return { items: next };
    }),
  clear: () => set({ items: {} }),
  lines: () =>
    Object.entries(get().items)
      .map(([id, qty]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        return product ? { product, qty } : null;
      })
      .filter((x): x is CartLine => x !== null),
  count: () => Object.values(get().items).reduce((a, b) => a + b, 0),
  total: () => get().lines().reduce((sum, l) => sum + l.product.price * l.qty, 0),
}));

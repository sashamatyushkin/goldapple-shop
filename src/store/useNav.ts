import { create } from "zustand";

export type Screen = "home" | "catalog" | "cart" | "profile" | "product" | "checkout";

export interface NavEntry {
  screen: Screen;
  productId?: string;
}

// Табы = корневые экраны. product/checkout — накладываются поверх (push).
export const TAB_ROOTS: Screen[] = ["home", "catalog", "cart", "profile"];

interface NavState {
  stack: NavEntry[];
  current: NavEntry;
  push: (entry: NavEntry) => void;
  pop: () => void;
  selectTab: (screen: Screen) => void;
  canGoBack: () => boolean;
}

export const useNav = create<NavState>((set, get) => ({
  stack: [{ screen: "home" }],
  current: { screen: "home" },
  push: (entry) =>
    set((s) => {
      const stack = [...s.stack, entry];
      return { stack, current: entry };
    }),
  pop: () =>
    set((s) => {
      if (s.stack.length <= 1) return s;
      const stack = s.stack.slice(0, -1);
      return { stack, current: stack[stack.length - 1] };
    }),
  selectTab: (screen) => set({ stack: [{ screen }], current: { screen } }),
  canGoBack: () => get().stack.length > 1,
}));

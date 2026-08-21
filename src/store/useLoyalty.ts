import { create } from "zustand";
import { storageGet, storageSet } from "../lib/cloudStorage";
import { applyPurchase, initialLoyalty, type ApplyResult, type LoyaltyState } from "../lib/loyalty";

const STORAGE_KEY = "loyalty_v1";

interface LoyaltyStore extends LoyaltyState {
  loaded: boolean;
  hydrate: () => Promise<void>;
  checkout: (amount: number, items: number, useBonuses: boolean) => ApplyResult;
  reset: () => void;
}

export const useLoyalty = create<LoyaltyStore>((set, get) => ({
  ...initialLoyalty,
  loaded: false,

  hydrate: async () => {
    const saved = await storageGet<LoyaltyState>(STORAGE_KEY, initialLoyalty);
    set({ ...saved, loaded: true });
  },

  checkout: (amount, items, useBonuses) => {
    const result = applyPurchase(
      { balance: get().balance, spent: get().spent, history: get().history },
      amount,
      items,
      useBonuses
    );
    set({ ...result.next });
    void storageSet(STORAGE_KEY, result.next);
    return result;
  },

  reset: () => {
    set({ ...initialLoyalty });
    void storageSet(STORAGE_KEY, initialLoyalty);
  },
}));

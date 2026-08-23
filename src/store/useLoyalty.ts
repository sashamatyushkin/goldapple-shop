import { create } from "zustand";
import { storageGet, storageSet } from "../lib/cloudStorage";
import { applyPurchase, demoSeed, initialLoyalty, type ApplyResult, type LoyaltyState } from "../lib/loyalty";

const STORAGE_KEY = "loyalty_v2";

interface LoyaltyStore extends LoyaltyState {
  loaded: boolean;
  hydrate: () => Promise<void>;
  addBonuses: (n: number) => void;
  checkout: (amount: number, items: number, useBonuses: boolean) => ApplyResult;
  reset: () => void;
}

export const useLoyalty = create<LoyaltyStore>((set, get) => ({
  ...initialLoyalty,
  loaded: false,

  hydrate: async () => {
    // Первый вход — сразу статус gold (демо для воркшопа)
    const saved = await storageGet<LoyaltyState>(STORAGE_KEY, demoSeed);
    set({ ...saved, loaded: true });
  },

  addBonuses: (n: number) => {
    const next = { balance: get().balance + n, spent: get().spent, history: get().history };
    set({ ...next });
    void storageSet(STORAGE_KEY, next);
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
    // Возврат к демо-состоянию gold + сброс ежедневного бонуса и колеса
    set({ ...demoSeed });
    void storageSet(STORAGE_KEY, demoSeed);
    void storageSet("daily_v1", { last: "", streak: 0 });
    void storageSet("wheel_v1", { last: "" });
  },
}));

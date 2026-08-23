// Конфиг и расчёты программы лояльности. Всё в одном месте — легко менять на воркшопе.

export interface Tier {
  id: "silver" | "gold" | "platinum";
  name: string;
  cashback: number; // доля, напр. 0.05 = 5%
  threshold: number; // сумма покупок (₽) для входа в уровень
}

export const TIERS: Tier[] = [
  { id: "silver", name: "silver", cashback: 0.05, threshold: 0 },
  { id: "gold", name: "gold", cashback: 0.07, threshold: 10000 },
  { id: "platinum", name: "platinum", cashback: 0.1, threshold: 25000 },
];

export interface Purchase {
  id: string;
  date: number; // timestamp
  amount: number; // сумма покупки, ₽
  earned: number; // начислено бонусов
  items: number; // кол-во позиций
}

export interface LoyaltyState {
  balance: number; // бонусный баланс
  spent: number; // накопленная сумма покупок
  history: Purchase[];
}

export const initialLoyalty: LoyaltyState = { balance: 0, spent: 0, history: [] };

// Демо-сид: клиент уже в статусе gold — чтобы на воркшопе сразу видеть, как работает уровень.
export const demoSeed: LoyaltyState = {
  balance: 1240,
  spent: 14200,
  history: [
    { id: "M-10024881", date: Date.now() - 1000 * 60 * 60 * 24 * 3, amount: 9890, earned: 494, items: 1 },
    { id: "M-10021547", date: Date.now() - 1000 * 60 * 60 * 24 * 18, amount: 4310, earned: 215, items: 2 },
  ],
};

export function tierForSpent(spent: number): Tier {
  let current = TIERS[0];
  for (const t of TIERS) if (spent >= t.threshold) current = t;
  return current;
}

export function nextTier(spent: number): Tier | null {
  return TIERS.find((t) => t.threshold > spent) ?? null;
}

// Прогресс до следующего уровня (0..1) + сколько ещё потратить
export function tierProgress(spent: number): { progress: number; remaining: number; next: Tier | null } {
  const current = tierForSpent(spent);
  const next = nextTier(spent);
  if (!next) return { progress: 1, remaining: 0, next: null };
  const span = next.threshold - current.threshold;
  const done = spent - current.threshold;
  return { progress: Math.min(1, Math.max(0, done / span)), remaining: next.threshold - spent, next };
}

export function cashbackFor(spent: number): number {
  return tierForSpent(spent).cashback;
}

// Результат оформления покупки
export interface ApplyResult {
  next: LoyaltyState;
  earned: number;
  spentBonuses: number;
  levelUp: Tier | null; // не null, если поднялся уровень
}

export function applyPurchase(
  state: LoyaltyState,
  amount: number,
  items: number,
  useBonuses: boolean
): ApplyResult {
  const spentBonuses = useBonuses ? Math.min(state.balance, Math.floor(amount * 0.5)) : 0; // списываем до 50% чека
  const payable = amount - spentBonuses;
  const earned = Math.floor(payable * cashbackFor(state.spent));

  const prevTier = tierForSpent(state.spent);
  const newSpent = state.spent + payable;
  const newTier = tierForSpent(newSpent);

  const purchase: Purchase = {
    id: "M-" + Date.now().toString().slice(-8),
    date: Date.now(),
    amount: payable,
    earned,
    items,
  };

  return {
    next: {
      balance: state.balance - spentBonuses + earned,
      spent: newSpent,
      history: [purchase, ...state.history].slice(0, 50),
    },
    earned,
    spentBonuses,
    levelUp: newTier.id !== prevTier.id ? newTier : null,
  };
}

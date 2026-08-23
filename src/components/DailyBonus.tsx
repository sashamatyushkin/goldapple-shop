import { useEffect, useState } from "react";
import { storageGet, storageSet } from "../lib/cloudStorage";
import { useLoyalty } from "../store/useLoyalty";
import { haptic } from "../telegram";
import { useToast } from "./ui/Toast";

const KEY = "daily_v1";
const REWARD = 50;
const today = () => new Date().toISOString().slice(0, 10);

interface Daily {
  last: string;
  streak: number;
}

// Ежедневный бонус со «стриком» — механика удержания (Starbucks, Duolingo, Aviasales).
export function DailyBonus() {
  const [state, setState] = useState<Daily | null>(null);
  const addBonuses = useLoyalty((s) => s.addBonuses);
  const toast = useToast((s) => s.show);

  useEffect(() => {
    void storageGet<Daily>(KEY, { last: "", streak: 0 }).then(setState);
  }, []);

  if (!state) return null;
  const claimedToday = state.last === today();

  const claim = () => {
    if (claimedToday) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streak = state.last === yesterday ? state.streak + 1 : 1;
    const next = { last: today(), streak };
    setState(next);
    void storageSet(KEY, next);
    addBonuses(REWARD);
    haptic.notify("success");
    toast(`+${REWARD} бонусов · день ${streak} 🔥`);
  };

  return (
    <button
      onClick={claim}
      disabled={claimedToday}
      className={`w-full flex items-center gap-3 rounded-2xl px-4 h-16 text-left transition ${
        claimedToday ? "bg-black/[0.04]" : "bg-lime-soft active:scale-[0.99]"
      }`}
    >
      <span className="w-11 h-11 rounded-full bg-lime grid place-items-center text-2xl shrink-0">
        {claimedToday ? "✓" : "🎁"}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-extrabold lowercase">
          {claimedToday ? "бонус получен сегодня" : "ежедневный бонус +50"}
        </div>
        <div className="text-[12px] text-black/50 lowercase">
          {claimedToday ? `возвращайся завтра · серия ${state.streak} 🔥` : "заходи каждый день и копи серию"}
        </div>
      </div>
      {!claimedToday && <span className="text-[13px] font-bold text-ink shrink-0">забрать →</span>}
    </button>
  );
}

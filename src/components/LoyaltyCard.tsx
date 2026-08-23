import { useLoyalty } from "../store/useLoyalty";
import { tierForSpent, tierProgress } from "../lib/loyalty";
import { formatNumber, formatPrice } from "../lib/format";
import { ProgressBar } from "./ui/ProgressBar";

interface Props {
  onOpenCard?: () => void;
}

// Анимацию влёта проигрываем один раз за сессию — чтобы при переключении
// вкладок карта не «крутилась» повторно и не лагала на слабых телефонах.
let introPlayed = false;

export function LoyaltyCard({ onOpenCard }: Props) {
  const { balance, spent } = useLoyalty();
  const tier = tierForSpent(spent);
  const { progress, remaining, next } = tierProgress(spent);

  const animate = !introPlayed;
  if (!introPlayed) introPlayed = true;

  return (
    <button
      onClick={onOpenCard}
      className={`${animate ? "animate-card-in" : ""} w-full text-left rounded-[22px] p-5 bg-ink text-white relative overflow-hidden active:scale-[0.99] transition`}
    >
      {/* лаймовое свечение — дешёвый радиальный градиент вместо blur-фильтра */}
      <div
        className="absolute -right-12 -top-14 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,244,50,0.30), transparent 70%)" }}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[13px] font-bold tracking-[0.14em] uppercase">золотое яблоко</div>
            <div className="text-[12px] text-lime font-semibold mt-0.5 lowercase">
              уровень {tier.name} · {Math.round(tier.cashback * 100)}% бонусами
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-lime text-ink rounded-full px-3 py-1">карта</span>
        </div>

        <div className="mt-5 flex items-baseline gap-1.5">
          <span className="text-[34px] font-extrabold leading-none">{formatNumber(balance)}</span>
          <span className="text-[13px] text-white/70 font-medium">бонусов</span>
        </div>

        <div className="mt-4">
          <ProgressBar value={progress} tone="lime" />
          <div className="flex justify-between text-[11.5px] text-white/70 mt-2 lowercase">
            {next ? (
              <>
                <span>до {next.name}</span>
                <span>ещё {formatPrice(remaining)}</span>
              </>
            ) : (
              <span>максимальный уровень достигнут ✦</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

import { useState } from "react";
import { useCart } from "../store/useCart";
import { useLoyalty } from "../store/useLoyalty";
import { useNav } from "../store/useNav";
import { formatPrice, formatNumber } from "../lib/format";
import { Button } from "../components/ui/Button";
import { tierForSpent } from "../lib/loyalty";
import { haptic } from "../telegram";
import type { ApplyResult } from "../lib/loyalty";

export function CheckoutScreen() {
  const lines = useCart((s) => s.lines());
  const total = useCart((s) => s.total());
  const count = useCart((s) => s.count());
  const clear = useCart((s) => s.clear);
  const checkout = useLoyalty((s) => s.checkout);
  const balance = useLoyalty((s) => s.balance);
  const spent = useLoyalty((s) => s.spent);
  const selectTab = useNav((s) => s.selectTab);

  const [useBonuses, setUseBonuses] = useState(false);
  const [result, setResult] = useState<ApplyResult | null>(null);

  const maxSpendable = Math.min(balance, Math.floor(total * 0.5));
  const bonusesToSpend = useBonuses ? maxSpendable : 0;
  const payable = total - bonusesToSpend;
  const willEarn = Math.floor(payable * tierForSpent(spent).cashback);

  if (result) {
    return (
      <div className="animate-fade-up pt-[calc(50px+var(--tg-safe-top))] px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-lime grid place-items-center mx-auto text-4xl">✓</div>
        <h1 className="text-[24px] font-extrabold mt-5 lowercase">заказ оформлен</h1>
        <p className="text-[14px] text-black/55 mt-1 lowercase">
          отслеживать статус можно в профиле
        </p>

        <div className="mt-6 rounded-2xl bg-black/[0.03] p-5 text-left">
          <Row label="начислено бонусов" value={`+${formatNumber(result.earned)}`} accent />
          {result.spentBonuses > 0 && <Row label="списано бонусами" value={`−${formatNumber(result.spentBonuses)}`} />}
          <Row label="новый баланс" value={`${formatNumber(result.next.balance)} б`} />
        </div>

        {result.levelUp && (
          <div className="mt-4 rounded-2xl bg-ink text-white p-4">
            <div className="text-lime text-[13px] font-bold uppercase tracking-wider">новый уровень!</div>
            <div className="text-[16px] font-extrabold mt-0.5 lowercase">
              теперь {result.levelUp.name} · {Math.round(result.levelUp.cashback * 100)}% бонусами
            </div>
          </div>
        )}

        <Button variant="primary" full className="mt-6" onClick={() => selectTab("home")}>
          продолжить покупки
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up pb-[220px]">
      <div className="pt-[calc(12px+var(--tg-safe-top))] px-4 pb-2">
        <h1 className="text-[22px] font-extrabold lowercase">оформление заказа</h1>
      </div>

      {/* состав */}
      <div className="px-4">
        <div className="rounded-2xl bg-black/[0.03] p-4">
          <div className="text-[13px] font-bold lowercase mb-2">ваш заказ · {count} шт.</div>
          {lines.map((l) => (
            <div key={l.product.id} className="flex justify-between text-[13px] py-1">
              <span className="text-black/60 truncate pr-2">
                {l.product.brand} × {l.qty}
              </span>
              <span className="font-semibold shrink-0">{formatPrice(l.product.price * l.qty)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* бонусы */}
      <div className="px-4 mt-3">
        <button
          onClick={() => {
            haptic.select();
            setUseBonuses((v) => !v);
          }}
          disabled={maxSpendable <= 0}
          className="w-full flex items-center justify-between rounded-2xl bg-black/[0.03] p-4 disabled:opacity-50"
        >
          <div className="text-left">
            <div className="text-[14px] font-bold lowercase">списать бонусы</div>
            <div className="text-[12px] text-black/50 lowercase">
              доступно {formatNumber(maxSpendable)} из {formatNumber(balance)}
            </div>
          </div>
          <span className={`w-12 h-7 rounded-full transition relative ${useBonuses ? "bg-lime" : "bg-black/15"}`}>
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${
                useBonuses ? "left-[26px]" : "left-0.5"
              }`}
            />
          </span>
        </button>
      </div>

      {/* доставка/оплата (демо) */}
      <div className="px-4 mt-3 space-y-2">
        <InfoRow title="доставка" value="курьер · завтра 10:00–12:00" />
        <InfoRow title="оплата" value="онлайн · при получении" />
      </div>

      {/* итог */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-black/[0.06] p-4 pb-[calc(16px+var(--tg-safe-bottom))] z-40">
        <div className="flex justify-between text-[13px] text-black/55 mb-1">
          <span className="lowercase">начислим бонусами</span>
          <span className="text-lime-dark font-bold">+{formatNumber(willEarn)}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] text-black/55 lowercase">к оплате</span>
          <span className="text-[22px] font-extrabold">{formatPrice(payable)}</span>
        </div>
        <Button
          variant="primary"
          full
          onClick={() => {
            const r = checkout(total, count, useBonuses);
            clear();
            haptic.notify("success");
            setResult(r);
          }}
        >
          оплатить {formatPrice(payable)}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 text-[14px]">
      <span className="text-black/55 lowercase">{label}</span>
      <span className={`font-bold ${accent ? "text-lime-dark" : ""}`}>{value}</span>
    </div>
  );
}

function InfoRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 h-14">
      <span className="text-[14px] font-bold lowercase">{title}</span>
      <span className="text-[13px] text-black/50 lowercase">{value}</span>
    </div>
  );
}

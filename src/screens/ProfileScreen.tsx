import { useState } from "react";
import { useLoyalty } from "../store/useLoyalty";
import { LoyaltyCard } from "../components/LoyaltyCard";
import { LoyaltyCardSheet } from "../components/LoyaltyCardSheet";
import { ReferralCard } from "../components/ReferralCard";
import { TIERS, tierForSpent } from "../lib/loyalty";
import { formatNumber, formatPrice } from "../lib/format";
import { tgUser } from "../telegram";

export function ProfileScreen() {
  const { spent, history, reset } = useLoyalty();
  const [cardOpen, setCardOpen] = useState(false);
  const tier = tierForSpent(spent);

  return (
    <div className="animate-fade-up pb-6">
      {/* шапка профиля */}
      <div className="pt-[calc(14px+var(--tg-safe-top))] px-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-lime grid place-items-center text-xl font-extrabold">
          {tgUser.first_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-[18px] font-extrabold">
            {tgUser.first_name} {tgUser.last_name ?? ""}
          </div>
          <div className="text-[13px] text-black/45 lowercase">
            {tgUser.username ? "@" + tgUser.username : "клиент клуба"}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <LoyaltyCard onOpenCard={() => setCardOpen(true)} />
      </div>

      {/* реферальная программа */}
      <div className="px-4 mt-3">
        <ReferralCard />
      </div>

      {/* лестница уровней */}
      <section className="mt-6 px-4">
        <h2 className="text-[16px] font-extrabold lowercase mb-3">уровни клуба</h2>
        <div className="space-y-2">
          {TIERS.map((t) => {
            const active = t.id === tier.id;
            const reached = spent >= t.threshold;
            return (
              <div
                key={t.id}
                className={`flex items-center justify-between rounded-2xl px-4 h-14 border ${
                  active ? "bg-ink text-white border-ink" : "border-black/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[15px] font-extrabold lowercase ${active ? "text-lime" : ""}`}>{t.name}</span>
                  <span className={`text-[12px] ${active ? "text-white/60" : "text-black/45"} lowercase`}>
                    {Math.round(t.cashback * 100)}% бонусами
                  </span>
                </div>
                <span className={`text-[12px] lowercase ${active ? "text-white/70" : "text-black/40"}`}>
                  {reached ? "✓ открыт" : `от ${formatPrice(t.threshold)}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* история покупок */}
      <section className="mt-6 px-4">
        <h2 className="text-[16px] font-extrabold lowercase mb-3">история покупок</h2>
        {history.length === 0 ? (
          <div className="rounded-2xl bg-black/[0.03] p-6 text-center text-[13px] text-black/45 lowercase">
            пока нет покупок. оформите первый заказ — и увидите начисления
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 h-16">
                <div>
                  <div className="text-[13px] font-bold">заказ {p.id}</div>
                  <div className="text-[12px] text-black/45 lowercase">
                    {new Date(p.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })} · {p.items} шт.
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-extrabold">{formatPrice(p.amount)}</div>
                  <div className="text-[12px] text-lime-dark font-bold">+{formatNumber(p.earned)} б</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* сброс демо-данных */}
      <div className="px-4 mt-6">
        <button
          onClick={reset}
          className="w-full h-11 rounded-full text-[13px] text-black/40 border border-black/10 lowercase"
        >
          сбросить демо-данные
        </button>
      </div>

      <LoyaltyCardSheet open={cardOpen} onClose={() => setCardOpen(false)} />
    </div>
  );
}

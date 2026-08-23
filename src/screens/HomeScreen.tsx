import { useState } from "react";
import { LoyaltyCard } from "../components/LoyaltyCard";
import { PromoRail } from "../components/PromoRail";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";
import { LoyaltyCardSheet } from "../components/LoyaltyCardSheet";
import { Countdown } from "../components/Countdown";
import { DailyBonus } from "../components/DailyBonus";
import { WheelModal } from "../components/WheelModal";
import { useNav } from "../store/useNav";

export function HomeScreen() {
  const [cardOpen, setCardOpen] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const push = useNav((s) => s.push);
  const hits = PRODUCTS.filter((p) => p.hit);
  const rest = PRODUCTS.filter((p) => !p.hit);

  return (
    <div className="animate-fade-up">
      {/* адрес доставки */}
      <div className="pt-[calc(10px+var(--tg-safe-top))] pb-3 text-center">
        <div className="text-[10px] tracking-[0.18em] uppercase text-black/40">адрес доставки</div>
        <div className="text-[15px] font-bold mt-0.5">Екатерины Будановой, 5</div>
      </div>

      {/* hero-баннер */}
      <div className="px-4">
        <button
          onClick={() => push({ screen: "catalog" })}
          className="w-full text-left rounded-[22px] overflow-hidden relative h-52 active:scale-[0.99] transition"
          style={{ background: "linear-gradient(135deg,#C6F432 0%,#DcF98A 55%,#F3FBD6 100%)" }}
        >
          <div className="absolute top-4 right-4 bg-ink/90 text-lime text-[12px] font-bold rounded-full px-3 h-7 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
            до конца · <Countdown />
          </div>
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            <div className="text-[26px] font-extrabold leading-none lowercase">лаймовые цены</div>
            <div className="text-[13px] text-ink/70 mt-1.5 lowercase">скидки до −50% на товары месяца</div>
            <span className="mt-3 inline-flex items-center gap-2 self-start bg-ink text-white text-[13px] font-semibold rounded-full px-4 h-10">
              перейти к акции →
            </span>
          </div>
        </button>
      </div>

      {/* карта лояльности */}
      <div className="px-4 mt-4">
        <LoyaltyCard onOpenCard={() => setCardOpen(true)} />
      </div>

      {/* ежедневный бонус */}
      <div className="px-4 mt-3">
        <DailyBonus />
      </div>

      {/* колесо фортуны */}
      <div className="px-4 mt-3">
        <button
          onClick={() => setWheelOpen(true)}
          className="w-full flex items-center gap-3 rounded-2xl px-4 h-16 text-left bg-ink text-white relative overflow-hidden active:scale-[0.99] transition"
        >
          <div
            className="absolute -right-6 -top-8 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(198,244,50,0.28), transparent 70%)" }}
          />
          <span className="relative w-11 h-11 rounded-full bg-lime grid place-items-center text-2xl shrink-0">🎡</span>
          <div className="relative flex-1 min-w-0">
            <div className="text-[14px] font-extrabold lowercase">колесо фортуны</div>
            <div className="text-[12px] text-white/60 lowercase">крути и выигрывай бонусы и подарки</div>
          </div>
          <span className="relative text-lime text-[13px] font-bold shrink-0">крутить →</span>
        </button>
      </div>

      {/* промо-круги */}
      <div className="mt-5">
        <PromoRail />
      </div>

      {/* хиты */}
      <Section title="хиты продаж">
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4">
          {hits.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* новинки */}
      <Section title="новинки">
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4">
          {rest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      <LoyaltyCardSheet open={cardOpen} onClose={() => setCardOpen(false)} />
      <WheelModal open={wheelOpen} onClose={() => setWheelOpen(false)} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="px-4 text-[19px] font-extrabold lowercase mb-3">{title}</h2>
      {children}
    </section>
  );
}

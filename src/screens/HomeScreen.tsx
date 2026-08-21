import { useState } from "react";
import { LoyaltyCard } from "../components/LoyaltyCard";
import { PromoRail } from "../components/PromoRail";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";
import { LoyaltyCardSheet } from "../components/LoyaltyCardSheet";
import { useNav } from "../store/useNav";

export function HomeScreen() {
  const [cardOpen, setCardOpen] = useState(false);
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

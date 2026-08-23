import { useCart } from "../store/useCart";
import { useNav } from "../store/useNav";
import { ProductImage } from "../components/ProductImage";
import { formatPrice } from "../lib/format";
import { Button } from "../components/ui/Button";
import { haptic } from "../telegram";

export function CartScreen() {
  const lines = useCart((s) => s.lines());
  const total = useCart((s) => s.total());
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const push = useNav((s) => s.push);
  const selectTab = useNav((s) => s.selectTab);

  if (lines.length === 0) {
    return (
      <div className="animate-fade-up pt-[calc(60px+var(--tg-safe-top))] flex flex-col items-center px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-lime-soft grid place-items-center text-3xl">🛍️</div>
        <h2 className="text-[18px] font-extrabold mt-4 lowercase">корзина пуста</h2>
        <p className="text-[14px] text-black/50 mt-1 lowercase">добавьте товары из каталога — и бонусы начнут копиться</p>
        <Button variant="lime" className="mt-5" onClick={() => selectTab("catalog")}>
          перейти в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up pb-[160px]">
      <div className="pt-[calc(12px+var(--tg-safe-top))] px-4 pb-2">
        <h1 className="text-[22px] font-extrabold lowercase">корзина</h1>
        <div className="text-[13px] text-black/45 lowercase">{lines.length} товара</div>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {lines.map((l) => (
          <div key={l.product.id} className="flex gap-3 items-center">
            <div className="w-20 h-24 rounded-xl overflow-hidden bg-black/[0.03] shrink-0">
              <ProductImage product={l.product} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold">{l.product.brand}</div>
              <div className="text-[12px] text-black/55 line-clamp-1">{l.product.name}</div>
              <div className="text-[15px] font-extrabold mt-1">{formatPrice(l.product.price * l.qty)}</div>
            </div>
            <div className="flex items-center gap-2.5 bg-black/[0.05] rounded-full px-1 h-9">
              <button onClick={() => remove(l.product.id)} className="w-7 h-7 grid place-items-center text-lg">
                −
              </button>
              <span className="text-[14px] font-bold w-4 text-center tabular-nums">{l.qty}</span>
              <button onClick={() => add(l.product.id)} className="w-7 h-7 grid place-items-center text-lg">
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* итог + оформить */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-black/[0.06] p-4 pb-[calc(16px+var(--tg-safe-bottom))] z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] text-black/55 lowercase">сумма заказа</span>
          <span className="text-[20px] font-extrabold">{formatPrice(total)}</span>
        </div>
        <Button
          variant="primary"
          full
          onClick={() => {
            haptic.impact("medium");
            push({ screen: "checkout" });
          }}
        >
          оформить заказ
        </Button>
      </div>
    </div>
  );
}

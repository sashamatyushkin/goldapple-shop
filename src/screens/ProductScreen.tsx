import { productById } from "../data/products";
import { ProductImage } from "../components/ProductImage";
import { formatPrice } from "../lib/format";
import { Button } from "../components/ui/Button";
import { useCart } from "../store/useCart";
import { useNav } from "../store/useNav";
import { tierForSpent } from "../lib/loyalty";
import { useLoyalty } from "../store/useLoyalty";
import { haptic } from "../telegram";
import { useToast } from "../components/ui/Toast";

export function ProductScreen({ productId }: { productId: string }) {
  const product = productById(productId);
  const add = useCart((s) => s.add);
  const itemQty = useCart((s) => (product ? s.items[product.id] ?? 0 : 0));
  const push = useNav((s) => s.push);
  const spent = useLoyalty((s) => s.spent);
  const toast = useToast((s) => s.show);

  if (!product) return <div className="p-6 text-center text-black/40 lowercase">товар не найден</div>;

  const cashback = Math.round(product.price * tierForSpent(spent).cashback);

  return (
    <div className="animate-fade-up pb-4">
      <div className="pt-[calc(6px+var(--tg-safe-top))]" />
      <div className="mx-4 rounded-[22px] bg-black/[0.03] aspect-square overflow-hidden">
        <ProductImage product={product} className="w-full h-full" />
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-lime-dark font-bold">★ {product.rating.toFixed(1)}</span>
          {product.hit && <span className="text-black/40 lowercase">· хит продаж</span>}
        </div>
        <h1 className="text-[20px] font-extrabold mt-1 leading-tight">{product.brand}</h1>
        <p className="text-[14px] text-black/60 mt-0.5">
          {product.name}
          {product.volume ? `, ${product.volume}` : ""}
        </p>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-[26px] font-extrabold">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[15px] text-black/35 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <div className="mt-3 inline-flex items-center gap-2 bg-lime-soft rounded-full px-3.5 h-9">
          <span className="w-4 h-4 rounded-full bg-lime grid place-items-center text-[10px] font-bold">%</span>
          <span className="text-[12.5px] font-semibold text-ink lowercase">
            +{cashback.toLocaleString("ru-RU")} бонусов за покупку
          </span>
        </div>

        <div className="mt-5 space-y-3 text-[14px] text-black/70">
          <p className="lowercase">
            бестселлер категории. оригинальная продукция, официальная гарантия, доставка по москве от 150 ₽.
          </p>
        </div>
      </div>

      {/* нижняя панель действий */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-black/[0.06] p-4 pb-[calc(16px+var(--tg-safe-bottom))] z-40 flex gap-3">
        <Button
          variant="lime"
          full
          onClick={() => {
            add(product.id);
            haptic.notify("success");
            toast(itemQty > 0 ? "ещё одна в корзине" : "добавлено в корзину");
          }}
        >
          {itemQty > 0 ? `в корзине · ${itemQty}` : "в корзину"}
        </Button>
        <Button variant="primary" onClick={() => push({ screen: "cart" })} className="px-6">
          купить
        </Button>
      </div>
    </div>
  );
}

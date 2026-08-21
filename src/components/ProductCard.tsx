import type { Product } from "../data/products";
import { formatPrice } from "../lib/format";
import { ProductImage } from "./ProductImage";
import { useCart } from "../store/useCart";
import { useNav } from "../store/useNav";
import { useToast } from "./ui/Toast";
import { haptic } from "../telegram";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const add = useCart((s) => s.add);
  const push = useNav((s) => s.push);
  const toast = useToast((s) => s.show);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => push({ screen: "product", productId: product.id })}
        className="relative rounded-2xl bg-black/[0.03] aspect-[3/4] overflow-hidden active:scale-[0.98] transition"
      >
        <ProductImage product={product} className="w-full h-full" />
        {product.oldPrice && (
          <span className="absolute top-2 left-2 bg-lime text-ink text-[11px] font-bold px-2 py-0.5 rounded-full">
            −{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
        {product.isNew && !product.oldPrice && (
          <span className="absolute top-2 left-2 bg-ink text-white text-[11px] font-bold px-2 py-0.5 rounded-full lowercase">
            new
          </span>
        )}
      </button>

      <div className="mt-2 px-0.5">
        <div className="text-[13px] font-bold leading-tight">{product.brand}</div>
        <div className="text-[12px] text-black/55 leading-tight line-clamp-2 min-h-[30px]">{product.name}</div>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-extrabold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[11px] text-black/35 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <button
            aria-label="в корзину"
            onClick={() => {
              add(product.id);
              haptic.impact("medium");
              toast("добавлено в корзину");
            }}
            className="w-9 h-9 rounded-full bg-lime text-ink grid place-items-center active:scale-90 transition text-xl font-bold leading-none"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

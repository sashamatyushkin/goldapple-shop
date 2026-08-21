import type { Product } from "../data/products";

interface Props {
  product: Product;
  className?: string;
}

// Самодостаточный плейсхолдер: градиент бренда + силуэт флакона + подпись бренда.
export function ProductImage({ product, className = "" }: Props) {
  const [from, to] = product.tone;
  const gid = `g-${product.id}`;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#${gid})`} />
        {/* флакон */}
        <g fill="rgba(255,255,255,0.82)" stroke="rgba(0,0,0,0.06)" strokeWidth="1">
          <rect x="86" y="52" width="28" height="14" rx="3" />
          <rect x="80" y="66" width="40" height="86" rx="12" />
        </g>
        <rect x="80" y="98" width="40" height="30" fill="rgba(255,255,255,0.35)" />
      </svg>
      <span className="absolute bottom-2 left-2.5 text-[10px] font-bold tracking-wide text-ink/45 uppercase">
        {product.brand}
      </span>
    </div>
  );
}

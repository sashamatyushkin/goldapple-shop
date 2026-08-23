import { useState } from "react";
import type { Product } from "../data/products";

interface Props {
  product: Product;
  className?: string;
}

// Реальное фото товара с сайта Gold Apple (public/products/<id>.webp).
// При ошибке загрузки — плейсхолдер-градиент с силуэтом флакона.
export function ProductImage({ product, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}products/${product.id}.webp`;
  const [from, to] = product.tone;

  if (failed) {
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
          <g fill="rgba(255,255,255,0.82)" stroke="rgba(0,0,0,0.06)" strokeWidth="1">
            <rect x="86" y="52" width="28" height="14" rx="3" />
            <rect x="80" y="66" width="40" height="86" rx="12" />
          </g>
        </svg>
        <span className="absolute bottom-2 left-2.5 text-[10px] font-bold tracking-wide text-ink/45 uppercase">
          {product.brand}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <img
        src={src}
        alt={`${product.brand} ${product.name}`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

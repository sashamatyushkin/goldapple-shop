import type { Product, Shape } from "../data/products";

interface Props {
  product: Product;
  className?: string;
}

// Чистые векторные packshot'ы под тип упаковки — чёткие при любом разрешении.
export function ProductImage({ product, className = "" }: Props) {
  const { tone, cap, body, id, brand } = product;
  const bg = `bg-${id}`;
  const hi = "rgba(255,255,255,0.55)";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tone[0]} />
            <stop offset="100%" stopColor={tone[1]} />
          </linearGradient>
        </defs>
        <rect width="200" height="240" fill={`url(#${bg})`} />
        {/* мягкая тень под товаром */}
        <ellipse cx="100" cy="212" rx="46" ry="9" fill="rgba(0,0,0,0.10)" />
        {renderShape(product.shape, cap, body, hi)}
      </svg>
      <span className="absolute bottom-2 left-2.5 text-[10px] font-bold tracking-wide text-ink/45 uppercase">
        {brand}
      </span>
    </div>
  );
}

function renderShape(shape: Shape, cap: string, body: string, hi: string) {
  switch (shape) {
    case "perfume":
      return (
        <g>
          <rect x="90" y="58" width="20" height="20" rx="3" fill={cap} />
          <rect x="94" y="76" width="12" height="12" fill={cap} opacity="0.85" />
          <rect x="72" y="86" width="56" height="118" rx="12" fill={body} />
          <rect x="80" y="96" width="14" height="98" rx="7" fill={hi} opacity="0.5" />
          <rect x="72" y="86" width="56" height="118" rx="12" fill="none" stroke="rgba(0,0,0,0.06)" />
        </g>
      );
    case "jar":
      return (
        <g>
          <rect x="60" y="126" width="80" height="74" rx="16" fill={body} />
          <rect x="56" y="100" width="88" height="32" rx="12" fill={cap} />
          <rect x="66" y="106" width="22" height="12" rx="6" fill={hi} opacity="0.6" />
          <rect x="60" y="126" width="80" height="74" rx="16" fill="none" stroke="rgba(0,0,0,0.06)" />
        </g>
      );
    case "dropper":
      return (
        <g>
          <rect x="86" y="62" width="28" height="16" rx="4" fill={cap} />
          <rect x="92" y="76" width="16" height="26" rx="5" fill={cap} opacity="0.8" />
          <rect x="80" y="100" width="40" height="104" rx="12" fill={body} />
          <rect x="86" y="110" width="10" height="84" rx="5" fill={hi} opacity="0.5" />
          <rect x="80" y="100" width="40" height="104" rx="12" fill="none" stroke="rgba(0,0,0,0.06)" />
        </g>
      );
    case "lipstick":
      return (
        <g>
          <path d="M88 96 q12 -28 24 0 v10 h-24 z" fill={body} />
          <rect x="84" y="106" width="32" height="24" rx="3" fill={cap} opacity="0.55" />
          <rect x="82" y="130" width="36" height="74" rx="6" fill={cap} />
          <rect x="88" y="138" width="8" height="58" rx="4" fill={hi} opacity="0.5" />
        </g>
      );
    case "pump":
      return (
        <g>
          <rect x="92" y="60" width="8" height="26" fill={cap} />
          <rect x="80" y="56" width="26" height="9" rx="4" fill={cap} />
          <rect x="90" y="84" width="20" height="14" rx="3" fill={cap} opacity="0.85" />
          <rect x="74" y="98" width="52" height="106" rx="14" fill={body} />
          <rect x="82" y="108" width="12" height="86" rx="6" fill={hi} opacity="0.5" />
          <rect x="74" y="98" width="52" height="106" rx="14" fill="none" stroke="rgba(0,0,0,0.06)" />
        </g>
      );
    case "tool":
      return (
        <g>
          <rect x="88" y="60" width="24" height="60" rx="12" fill={cap} />
          <rect x="90" y="118" width="20" height="86" rx="10" fill={body} />
          <rect x="94" y="128" width="6" height="66" rx="3" fill={hi} opacity="0.5" />
          <ellipse cx="100" cy="60" rx="12" ry="5" fill={cap} />
          <rect x="90" y="118" width="20" height="86" rx="10" fill="none" stroke="rgba(0,0,0,0.06)" />
        </g>
      );
  }
}

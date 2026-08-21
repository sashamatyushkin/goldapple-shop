import { useNav } from "../store/useNav";
import { haptic } from "../telegram";

const circles = [
  { key: "sale", label: "скидки", glyph: "%" },
  { key: "gift", label: "gift card", glyph: "◧" },
  { key: "hits", label: "хиты", glyph: "★" },
  { key: "new", label: "новинки", glyph: "✦" },
  { key: "forme", label: "for me", glyph: "♥" },
];

export function PromoRail() {
  const push = useNav((s) => s.push);
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
      {circles.map((c) => (
        <button
          key={c.key}
          onClick={() => {
            haptic.select();
            push({ screen: "catalog" });
          }}
          className="flex flex-col items-center gap-1.5 shrink-0"
        >
          <span className="w-16 h-16 rounded-full bg-lime grid place-items-center text-ink text-2xl font-bold">
            {c.glyph}
          </span>
          <span className="text-[11px] text-black/70 lowercase">{c.label}</span>
        </button>
      ))}
    </div>
  );
}

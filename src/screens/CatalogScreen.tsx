import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type Category } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { haptic } from "../telegram";

export function CatalogScreen() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const okCat = cat === "all" || p.category === cat;
      const okQ = !q || p.brand.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [query, cat]);

  return (
    <div className="animate-fade-up">
      {/* поиск */}
      <div className="pt-[calc(10px+var(--tg-safe-top))] px-4 pb-2 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2 bg-black/[0.05] rounded-full h-12 px-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="поиск"
            className="bg-transparent outline-none text-[15px] flex-1 placeholder:text-black/35 lowercase"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-black/40 text-lg leading-none">
              ×
            </button>
          )}
        </div>
      </div>

      {/* категории */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
        {[{ id: "all", label: "всё" }, ...CATEGORIES].map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                haptic.select();
                setCat(c.id as Category | "all");
              }}
              className={`shrink-0 h-9 px-4 rounded-full text-[13px] font-semibold lowercase transition ${
                active ? "bg-ink text-white" : "bg-black/[0.05] text-black/60"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* сетка */}
      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 mt-2">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center text-black/40 text-[14px] mt-20 lowercase">ничего не нашлось</div>
      )}
    </div>
  );
}

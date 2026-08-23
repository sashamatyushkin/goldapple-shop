import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { storageGet, storageSet } from "../lib/cloudStorage";
import { useLoyalty } from "../store/useLoyalty";
import { haptic } from "../telegram";
import { formatNumber } from "../lib/format";

// Призы под бьюти-нишу (референс: клиентские дни Gold Apple, Sephora, барабан AliExpress).
type Kind = "bonus" | "gift" | "promo";
interface Prize {
  label: string;
  short: string;
  kind: Kind;
  amount?: number;
  emoji: string;
  weight: number;
}

const PRIZES: Prize[] = [
  { label: "50 бонусов", short: "50 б", kind: "bonus", amount: 50, emoji: "✨", weight: 26 },
  { label: "пробник в подарок", short: "пробник", kind: "gift", emoji: "🎁", weight: 16 },
  { label: "100 бонусов", short: "100 б", kind: "bonus", amount: 100, emoji: "💚", weight: 20 },
  { label: "скидка 10%", short: "−10%", kind: "promo", emoji: "🏷️", weight: 12 },
  { label: "200 бонусов", short: "200 б", kind: "bonus", amount: 200, emoji: "⭐", weight: 12 },
  { label: "миниатюра аромата", short: "миниатюра", kind: "gift", emoji: "💎", weight: 8 },
  { label: "косметичка", short: "косметичка", kind: "gift", emoji: "👜", weight: 4 },
  { label: "500 бонусов", short: "500 б", kind: "bonus", amount: 500, emoji: "🔥", weight: 2 },
];

const N = PRIZES.length;
const SEG = 360 / N;
const KEY = "wheel_v1";
const today = () => new Date().toISOString().slice(0, 10);

function pickPrize(): number {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < N; i++) {
    r -= PRIZES[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}

// сектор от угла a0 до a1 (градусы, по часовой от верха)
function sector(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

function genCode(): string {
  return "GA-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function WheelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addBonuses = useLoyalty((s) => s.addBonuses);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ prize: Prize; code?: string } | null>(null);
  const [spunToday, setSpunToday] = useState(false);
  const targetIdx = useRef(0);

  useEffect(() => {
    if (open) void storageGet<{ last: string }>(KEY, { last: "" }).then((d) => setSpunToday(d.last === today()));
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const wheel = useMemo(
    () =>
      PRIZES.map((p, i) => {
        const a0 = i * SEG;
        const a1 = (i + 1) * SEG;
        const mid = a0 + SEG / 2;
        const rad = ((mid - 90) * Math.PI) / 180;
        const lx = 100 + 66 * Math.cos(rad);
        const ly = 100 + 66 * Math.sin(rad);
        const fill = i % 2 === 0 ? "#C6F432" : "#141414";
        const text = i % 2 === 0 ? "#0A0A0A" : "#FFFFFF";
        return { p, i, path: sector(100, 100, 100, a0, a1), lx, ly, mid, fill, text };
      }),
    []
  );

  const SPIN_MS = 4600;

  const finishSpin = (idx: number) => {
    const prize = PRIZES[idx];
    const code = prize.kind === "bonus" ? undefined : genCode();
    if (prize.kind === "bonus" && prize.amount) addBonuses(prize.amount);
    haptic.notify("success");
    setResult({ prize, code });
    setSpinning(false);
    setSpunToday(true);
    void storageSet(KEY, { last: today() });
  };

  const spin = () => {
    if (spinning || spunToday) return;
    const idx = pickPrize();
    targetIdx.current = idx;
    const jitter = (Math.random() - 0.5) * SEG * 0.6;
    // привести центр сектора idx под верхний указатель
    const target = 360 * 6 - (idx * SEG + SEG / 2) - jitter;
    setSpinning(true);
    haptic.impact("heavy");
    setRotation((prev) => prev - (prev % 360) + target);
    // завершение по таймеру — надёжнее transitionend на SVG
    window.setTimeout(() => finishSpin(idx), SPIN_MS + 120);
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex flex-col items-center bg-ink text-white overflow-y-auto">
      {/* фон-свечение */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 32%, rgba(198,244,50,0.18), transparent 60%)" }}
      />
      <button
        onClick={onClose}
        aria-label="закрыть"
        className="absolute top-[calc(14px+var(--tg-safe-top))] right-4 w-10 h-10 grid place-items-center rounded-full bg-white/10 text-white text-xl z-10"
      >
        ✕
      </button>

      <div className="relative pt-[calc(40px+var(--tg-safe-top))] pb-10 px-6 w-full max-w-app flex flex-col items-center">
        <div className="text-[12px] tracking-[0.2em] uppercase text-lime">колесо фортуны</div>
        <h1 className="text-[26px] font-extrabold mt-1 lowercase text-center">крути и забирай подарок</h1>
        <p className="text-[13px] text-white/60 mt-1 lowercase text-center">один бесплатный спин в день</p>

        {/* колесо */}
        <div className="relative mt-7 w-[300px] h-[300px]">
          {/* указатель */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-20">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "13px solid transparent",
                borderRight: "13px solid transparent",
                borderTop: "22px solid #C6F432",
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,.5))",
              }}
            />
          </div>
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-2xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            }}
          >
            <circle cx="100" cy="100" r="100" fill="#0A0A0A" />
            {wheel.map((s) => (
              <g key={s.i}>
                <path d={s.path} fill={s.fill} stroke="#0A0A0A" strokeWidth="1" />
                <g transform={`rotate(${s.mid} ${s.lx} ${s.ly})`}>
                  <text
                    x={s.lx}
                    y={s.ly}
                    fill={s.text}
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Onest, sans-serif"
                  >
                    {s.p.emoji} {s.p.short}
                  </text>
                </g>
              </g>
            ))}
            <circle cx="100" cy="100" r="16" fill="#C6F432" stroke="#0A0A0A" strokeWidth="3" />
          </svg>
        </div>

        {/* кнопка */}
        <button
          onClick={spin}
          disabled={spinning || spunToday}
          className="mt-8 w-full max-w-[300px] h-14 rounded-full bg-lime text-ink font-extrabold text-[16px] disabled:opacity-40 active:scale-[0.98] transition"
        >
          {spinning ? "крутится…" : spunToday ? "уже крутили сегодня" : "крутить бесплатно"}
        </button>
        {spunToday && !spinning && (
          <p className="text-[12px] text-white/50 mt-2 lowercase">возвращайся завтра за новым спином</p>
        )}
      </div>

      {/* результат */}
      {result && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center" onClick={() => setResult(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-app bg-white text-ink rounded-t-[24px] p-6 pb-[calc(24px+var(--tg-safe-bottom))] animate-sheet text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl">{result.prize.emoji}</div>
            <div className="text-[13px] text-lime-dark font-bold uppercase tracking-wider mt-3">твой выигрыш</div>
            <h2 className="text-[24px] font-extrabold mt-1 lowercase">{result.prize.label}</h2>
            {result.prize.kind === "bonus" ? (
              <p className="text-[14px] text-black/55 mt-1 lowercase">
                +{formatNumber(result.prize.amount!)} бонусов уже на балансе
              </p>
            ) : (
              <div className="mt-3">
                <p className="text-[13px] text-black/55 lowercase">покажи код на кассе или в корзине</p>
                <div className="mt-2 inline-block bg-black/[0.05] rounded-xl px-5 py-2 text-[18px] font-extrabold tracking-widest">
                  {result.code}
                </div>
              </div>
            )}
            <button
              onClick={() => setResult(null)}
              className="mt-6 w-full h-14 rounded-full bg-ink text-white font-semibold text-[15px] active:scale-[0.99] transition"
            >
              забрать
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

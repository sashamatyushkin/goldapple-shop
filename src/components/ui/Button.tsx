import type { ButtonHTMLAttributes, ReactNode } from "react";
import { haptic } from "../../telegram";

type Variant = "primary" | "lime" | "ghost" | "outline";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white",
  lime: "bg-lime text-ink",
  ghost: "bg-black/[0.04] text-ink",
  outline: "border border-black/15 text-ink",
};

export function Button({ variant = "primary", full, children, className = "", onClick, ...rest }: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} px-6 h-14 text-[15px] ${full ? "w-full" : ""} ${className}`}
      onClick={(e) => {
        haptic.impact("light");
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

interface Props {
  value: number; // 0..1
  className?: string;
  tone?: "lime" | "light";
}

export function ProgressBar({ value, className = "", tone = "lime" }: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  const track = tone === "lime" ? "bg-white/25" : "bg-black/10";
  const fill = tone === "lime" ? "bg-lime" : "bg-ink";
  return (
    <div className={`h-2 rounded-full overflow-hidden ${track} ${className}`}>
      <div
        className={`h-full rounded-full ${fill} transition-[width] duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

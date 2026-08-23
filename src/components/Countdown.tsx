import { useEffect, useState } from "react";

// Живой таймер до конца дня — приём срочности из топовых ритейл-приложений.
function msLeft(): number {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return end.getTime() - now.getTime();
}

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export function Countdown({ className = "" }: { className?: string }) {
  const [ms, setMs] = useState(msLeft());
  useEffect(() => {
    const t = setInterval(() => setMs(msLeft()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`tabular-nums ${className}`}>{fmt(ms)}</span>
  );
}

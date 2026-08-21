import { create } from "zustand";
import { useEffect } from "react";

interface ToastState {
  message: string | null;
  show: (m: string) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: null,
  show: (message) => set({ message }),
  hide: () => set({ message: null }),
}));

export function ToastHost() {
  const { message, hide } = useToast();
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, 2200);
    return () => clearTimeout(t);
  }, [message, hide]);

  if (!message) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(88px+var(--tg-safe-bottom))] z-[60] animate-fade-up">
      <div className="bg-ink text-white text-[14px] font-medium px-5 py-3 rounded-full shadow-lg max-w-[90vw] text-center">
        {message}
      </div>
    </div>
  );
}

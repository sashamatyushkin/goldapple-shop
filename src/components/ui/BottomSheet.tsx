import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, children }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Портал в body — чтобы оверлей не попадал под transform-предка (animate-fade-up)
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-up" onClick={onClose} />
      <div
        className="relative w-full max-w-app bg-white rounded-t-[24px] pb-[calc(20px+var(--tg-safe-bottom))] animate-sheet"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-11 rounded-full bg-black/15" />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

import { useState } from "react";
import { shareReferral, referralLink, copyText, haptic } from "../telegram";
import { BottomSheet } from "./ui/BottomSheet";
import { QrCode } from "./QrCode";
import { useToast } from "./ui/Toast";

// Реферальная программа — виральная петля роста (как в Ozon, Яндекс, Тинькофф).
export function ReferralCard() {
  const [open, setOpen] = useState(false);
  const toast = useToast((s) => s.show);
  const link = referralLink();

  return (
    <>
      <button
        onClick={() => {
          haptic.impact("light");
          setOpen(true);
        }}
        className="w-full text-left rounded-2xl p-5 bg-ink text-white relative overflow-hidden active:scale-[0.99] transition"
      >
        <div
          className="absolute -left-8 -bottom-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(198,244,50,0.22), transparent 70%)" }}
        />
        <div className="relative">
          <div className="text-[16px] font-extrabold lowercase">приведи друга</div>
          <p className="text-[13px] text-white/70 mt-1 lowercase leading-snug">
            другу — <span className="text-lime font-semibold">+500 бонусов</span> на первую покупку, тебе —{" "}
            <span className="text-lime font-semibold">+500</span>, когда он её оформит
          </p>
          <span className="mt-3 inline-flex items-center gap-2 bg-lime text-ink font-semibold text-[14px] rounded-full px-5 h-11">
            показать ссылку и qr →
          </span>
        </div>
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div className="px-5 pt-1">
          <div className="text-center text-[15px] font-bold lowercase mb-1">пригласи друга</div>
          <p className="text-center text-[12.5px] text-black/50 lowercase mb-4">
            другу +500 бонусов, тебе +500 после его покупки
          </p>

          <div className="bg-white rounded-2xl p-4 border border-black/[0.06] flex justify-center">
            <div className="w-44 h-44">
              <QrCode value={link} className="w-full h-full" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 bg-black/[0.04] rounded-full pl-4 pr-1 h-12">
            <span className="flex-1 text-[13px] text-black/60 truncate lowercase">{link.replace("https://", "")}</span>
            <button
              onClick={async () => {
                const ok = await copyText(link);
                haptic.notify(ok ? "success" : "error");
                toast(ok ? "ссылка скопирована" : "не удалось скопировать");
              }}
              className="shrink-0 h-10 px-4 rounded-full bg-ink text-white text-[13px] font-semibold active:scale-95 transition"
            >
              копировать
            </button>
          </div>

          <button
            onClick={() => {
              haptic.impact("medium");
              shareReferral();
            }}
            className="mt-3 w-full h-14 rounded-full bg-lime text-ink font-semibold text-[15px] active:scale-[0.99] transition"
          >
            поделиться в telegram →
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

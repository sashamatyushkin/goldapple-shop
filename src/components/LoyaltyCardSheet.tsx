import { BottomSheet } from "./ui/BottomSheet";
import { QrCode } from "./QrCode";
import { useLoyalty } from "../store/useLoyalty";
import { tierForSpent } from "../lib/loyalty";
import { formatNumber } from "../lib/format";
import { tgUser } from "../telegram";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LoyaltyCardSheet({ open, onClose }: Props) {
  const { balance, spent } = useLoyalty();
  const tier = tierForSpent(spent);
  const cardId = String(tgUser.id).padStart(10, "0");

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pt-1">
        <div className="text-center text-[15px] font-bold lowercase mb-4">карта клуба</div>

        <div className="rounded-[22px] bg-ink text-white p-5 relative overflow-hidden">
          <div className="absolute -right-10 -top-12 w-44 h-44 rounded-full bg-lime/25 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-[13px] font-bold tracking-[0.14em] uppercase">золотое яблоко</div>
              <div className="text-[12px] text-lime font-semibold mt-0.5 lowercase">
                уровень {tier.name} · {Math.round(tier.cashback * 100)}%
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-lime text-ink rounded-full px-3 py-1">club</span>
          </div>
          <div className="relative mt-4 flex items-end justify-between">
            <div>
              <div className="text-[11px] text-white/60 lowercase">баланс</div>
              <div className="text-[26px] font-extrabold leading-none">{formatNumber(balance)} б</div>
            </div>
            <div className="bg-white rounded-xl p-1.5 w-24 h-24">
              <QrCode value={`GA-${cardId}`} className="w-full h-full" />
            </div>
          </div>
        </div>

        <div className="text-center text-[12px] text-black/45 mt-3 lowercase">
          номер карты · {cardId.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3")}
        </div>
        <p className="text-center text-[12px] text-black/45 mt-1 lowercase">
          покажите qr на кассе — бонусы начислятся автоматически
        </p>
      </div>
    </BottomSheet>
  );
}

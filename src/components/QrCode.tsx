import { useEffect, useState } from "react";
import QRCode from "qrcode";

// Настоящий сканируемый QR-код. Кодирует данные карты клиента —
// на кассе сканер считывает id и начисляет баллы (серверная часть — v2).
export function QrCode({ value, className = "" }: { value: string; className?: string }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(value, {
      errorCorrectionLevel: "M",
      margin: 1,
      scale: 8,
      color: { dark: "#0A0A0A", light: "#FFFFFF" },
    })
      .then(setUrl)
      .catch(() => setUrl(""));
  }, [value]);

  if (!url) return <div className={`bg-black/5 animate-pulse ${className}`} />;
  return <img src={url} alt="QR карты" className={className} style={{ imageRendering: "pixelated" }} />;
}

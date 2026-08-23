// Обёртка над Telegram WebApp API с безопасным фолбэком для обычного браузера.
// Позволяет разрабатывать и превьюить приложение вне Telegram.

type HapticStyle = "light" | "medium" | "heavy" | "rigid" | "soft";
type NotificationType = "error" | "success" | "warning";

interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TgWebApp {
  initData: string;
  initDataUnsafe: { user?: TgUser; start_param?: string };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportStableHeight: number;
  version?: string;
  ready: () => void;
  expand: () => void;
  requestFullscreen?: () => void;
  openTelegramLink?: (url: string) => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  disableVerticalSwipes?: () => void;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  MainButton: {
    setText: (t: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    setParams: (p: Record<string, unknown>) => void;
  };
  HapticFeedback: {
    impactOccurred: (s: HapticStyle) => void;
    notificationOccurred: (t: NotificationType) => void;
    selectionChanged: () => void;
  };
  CloudStorage: {
    setItem: (k: string, v: string, cb?: (e: Error | null, ok?: boolean) => void) => void;
    getItem: (k: string, cb: (e: Error | null, v?: string) => void) => void;
    removeItem: (k: string, cb?: (e: Error | null, ok?: boolean) => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

const wa = window.Telegram?.WebApp;
export const isTelegram = Boolean(wa && wa.initData !== undefined && wa.initDataUnsafe?.user);

// Демо-пользователь для разработки вне Telegram
const DEMO_USER: TgUser = { id: 99000001, first_name: "Гость", username: "guest" };

export const tgUser: TgUser = wa?.initDataUnsafe?.user ?? DEMO_USER;
export const startParam: string | undefined = wa?.initDataUnsafe?.start_param;

export function initTelegram() {
  if (!wa) return;
  wa.ready();
  wa.expand();
  try {
    // Полноэкранный режим (Bot API 8.0+); на старых клиентах просто expand
    if (parseFloat(wa.version ?? "6.0") >= 8.0) wa.requestFullscreen?.();
    wa.setHeaderColor("#ffffff");
    wa.setBackgroundColor("#ffffff");
    wa.disableVerticalSwipes?.();
  } catch {
    /* старые клиенты */
  }
}

export const haptic = {
  impact: (s: HapticStyle = "light") => wa?.HapticFeedback?.impactOccurred(s),
  notify: (t: NotificationType) => wa?.HapticFeedback?.notificationOccurred(t),
  select: () => wa?.HapticFeedback?.selectionChanged(),
};

export const backButton = {
  show(cb: () => void) {
    if (!wa) return;
    wa.BackButton.onClick(cb);
    wa.BackButton.show();
  },
  hide(cb: () => void) {
    if (!wa) return;
    wa.BackButton.offClick(cb);
    wa.BackButton.hide();
  },
};

export function closeApp() {
  wa?.close();
}

const BOT = "goldenaapple_bot";

// Реферальный deep link и шеринг через Telegram
export function referralLink(): string {
  return `https://t.me/${BOT}?startapp=ref_${tgUser.id}`;
}

export function shareReferral() {
  const text = "залетай в золотое яблоко 🍏 дарю тебе +500 бонусов на первую покупку по моей ссылке";
  const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink())}&text=${encodeURIComponent(text)}`;
  if (wa?.openTelegramLink) wa.openTelegramLink(url);
  else window.open(url, "_blank");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // фолбэк для старых webview
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

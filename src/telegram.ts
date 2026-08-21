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
  ready: () => void;
  expand: () => void;
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

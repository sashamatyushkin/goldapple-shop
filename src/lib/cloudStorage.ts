// Единый интерфейс хранилища: Telegram CloudStorage внутри Telegram,
// localStorage — в обычном браузере. Значения — JSON.

const wa = window.Telegram?.WebApp;
// CloudStorage реально доступен только внутри Telegram с настоящим пользователем
// и поддерживающим методы клиентом (>= 6.9). В обычном браузере объект-заглушка бросает ошибки.
const supportsCloud = (() => {
  if (!wa?.CloudStorage || !wa.initDataUnsafe?.user) return false;
  const v = parseFloat((wa as unknown as { version?: string }).version ?? "6.0");
  return v >= 6.9;
})();
const useCloud = supportsCloud;

export function storageGet<T>(key: string, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    if (useCloud && wa) {
      wa.CloudStorage.getItem(key, (err, val) => {
        if (err || !val) return resolve(fallback);
        try {
          resolve(JSON.parse(val) as T);
        } catch {
          resolve(fallback);
        }
      });
    } else {
      try {
        const raw = localStorage.getItem(key);
        resolve(raw ? (JSON.parse(raw) as T) : fallback);
      } catch {
        resolve(fallback);
      }
    }
  });
}

export function storageSet<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve) => {
    const raw = JSON.stringify(value);
    if (useCloud && wa) {
      wa.CloudStorage.setItem(key, raw, () => resolve());
    } else {
      try {
        localStorage.setItem(key, raw);
      } catch {
        /* ignore */
      }
      resolve();
    }
  });
}

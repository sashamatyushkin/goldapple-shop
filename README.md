# Золотое Яблоко — Telegram Mini App (MVP)

Магазин в визуальном стиле [Gold Apple](https://goldapple.ru) с **картой лояльности** и **прогресс-баром покупок**. Сделан для воркшопа: показывает полный путь DESIGN → UX → FRONTEND → TELEGRAM → LOYALTY на минимальном стеке.

Фишка «самого быстрого MVP»: данные лояльности (баланс, уровень, история, прогресс) хранятся в **Telegram CloudStorage** — значит на старте **не нужны ни backend, ни база**. Фронт — статика, бот — long-polling.

## Стек

- **React 18 + TypeScript + Vite** — быстрый билд, готовая статика
- **Tailwind CSS** — дизайн-система из токенов
- **Zustand** — лёгкий стейт (навигация, корзина, лояльность)
- **Telegram WebApp API** — user, theme, viewport, safe-area, BackButton, haptics, CloudStorage
- **grammY** — Telegram-бот (long-polling)

Бандл: ~57 KB gzip.

## Структура

```
goldapple-miniapp/
├── index.html               # подключение telegram-web-app.js + шрифт Onest
├── bot/bot.js               # Telegram-бот (кнопка «открыть магазин»)
├── src/
│   ├── main.tsx             # точка входа, initTelegram()
│   ├── App.tsx              # навигация, BackButton, таб-бар
│   ├── telegram.ts          # обёртка Telegram API + фолбэк для браузера
│   ├── data/products.ts     # статичный каталог топ-товаров
│   ├── lib/
│   │   ├── loyalty.ts       # ⭐ конфиг тиров, кэшбэк, расчёт покупки
│   │   ├── cloudStorage.ts  # CloudStorage / localStorage
│   │   └── format.ts
│   ├── store/               # zustand: useNav, useCart, useLoyalty
│   ├── components/          # LoyaltyCard, ProductCard, TabBar, QrCode, ui/*
│   └── screens/             # Home, Catalog, Product, Cart, Checkout, Profile
```

## Логика лояльности (`src/lib/loyalty.ts`)

Всё в одном файле — легко менять на воркшопе:

- **Тиры**: `silver 5%` → `gold 7%` (от 10 000 ₽) → `platinum 10%` (от 25 000 ₽)
- **Прогресс-бар** = сколько потрачено ÷ порог следующего уровня
- **Начисление** = кэшбэк текущего тира от суммы к оплате
- **Списание** — до 50% чека бонусами
- **Level-up** — при переходе порога показывается экран нового уровня + haptic

## Запуск локально

```bash
cd goldapple-miniapp
npm install
npm run dev
```

Откроется на `http://localhost:5173`. Вне Telegram работает демо-режим (гость + localStorage), поэтому можно разрабатывать в обычном браузере.

Сборка продакшена:

```bash
npm run build      # dist/
npm run preview
```

## Настройка Telegram-бота

1. Скопируйте `.env.example` → `.env` и заполните:
   ```
   BOT_TOKEN=<токен от @BotFather>
   WEBAPP_URL=<публичный https-адрес Mini App>
   ```
2. Запустите бота:
   ```bash
   npm run bot
   ```
3. Команды: `/start` — кнопка «открыть магазин», `/card` — карта клуба.

## Деплой (статика)

1. `npm run build` → папка `dist/`
2. Залейте `dist/` на **Cloudflare Pages** или **GitHub Pages** (HTTPS обязателен).
3. В **@BotFather** → `/newapp` (или *Bot Settings → Menu Button*) укажите URL Mini App.
4. Пропишите тот же адрес в `WEBAPP_URL` и перезапустите бота.

## Что дальше (v2, при необходимости)

CloudStorage хранит данные на стороне клиента — для боевой лояльности с деньгами нужен серверный пересчёт. Когда понадобится:

- **Backend** на Cloudflare Workers + D1/KV
- Валидация `initData` на сервере (подпись Telegram)
- Начисление покупок админом/баристой (скан QR)
- Реальная оплата: Telegram Payments + webhook

## Безопасность

- Реальный `BOT_TOKEN` только в `.env` (в git не попадает).
- Секретов во фронте нет.
- Для продакшена замените демо-QR (`src/components/QrCode.tsx`) на реальный с подписанным токеном.

// Telegram-бот на grammY (long-polling). Открывает Mini App кнопкой.
// Запуск: npm run bot  (читает .env через --env-file)
import { Bot, InlineKeyboard } from "grammy";

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;

if (!token) {
  console.error("✖ BOT_TOKEN не задан. Скопируйте .env.example → .env и вставьте токен от @BotFather.");
  process.exit(1);
}

// Telegram принимает web_app-кнопку только с публичным https-адресом.
const hasPublicApp = /^https:\/\//.test(webAppUrl ?? "") && !/localhost|127\.0\.0\.1/.test(webAppUrl);

if (!hasPublicApp) {
  console.warn(
    "⚠ WEBAPP_URL не задан или не публичный https — бот запустится, команды работают,\n" +
      "  но кнопка «открыть магазин» появится только после деплоя Mini App на публичный HTTPS."
  );
}

const bot = new Bot(token);

bot.command("start", async (ctx) => {
  if (hasPublicApp) {
    const kb = new InlineKeyboard().webApp("🍏 открыть магазин", webAppUrl);
    await ctx.reply(
      "золотое яблоко · клуб\n\nтоп-товары, карта лояльности и бонусы за каждую покупку. открывайте магазин прямо здесь 👇",
      { reply_markup: kb }
    );
  } else {
    await ctx.reply(
      "золотое яблоко · клуб 🍏\n\nбот запущен локально и на связи ✅\n" +
        "кнопка «открыть магазин» появится, когда Mini App будет опубликован на публичном https-адресе."
    );
  }
});

bot.command("card", async (ctx) => {
  if (hasPublicApp) {
    const kb = new InlineKeyboard().webApp("моя карта", `${webAppUrl}#profile`);
    await ctx.reply("ваша карта клуба и бонусный баланс — внутри приложения:", { reply_markup: kb });
  } else {
    await ctx.reply("карта клуба открывается в Mini App — доступно после публикации на https.");
  }
});

bot.command("ping", (ctx) => ctx.reply("pong 🏓 бот работает"));

bot.catch((err) => console.error("bot error:", err));

bot.start({
  onStart: (me) => console.log(`✔ бот @${me.username} запущен (long-polling)`),
});

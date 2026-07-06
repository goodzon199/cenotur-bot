import { Telegraf } from 'telegraf';
import { SocksProxyAgent } from 'socks-proxy-agent';
import cron from 'node-cron';
import { config } from './config';
import { loadDb, getAllSubscriptions } from './database';
import { setupBot } from './bot/commands';
import { searchFlights, buildAffiliateLink, FlightOffer } from './api/travelpayouts';

const botOptions: Record<string, any> = {};
if (config.proxy) {
  botOptions.telegram = { agent: new SocksProxyAgent(config.proxy) };
  console.log(`Using proxy: ${config.proxy}`);
}
const bot = new Telegraf(config.bot.token, botOptions);

loadDb();
setupBot(bot);

async function monitorPrices() {
  console.log(`[${new Date().toISOString()}] Checking prices for all subscriptions...`);
  const allSubs = getAllSubscriptions();

  for (const { chatId, sub } of allSubs) {
    try {
      const flights = await searchFlights({
        origin: sub.originIata,
        destination: sub.destinationIata,
        departDate: sub.departDate,
        returnDate: sub.returnDate,
        currency: sub.currency,
      });

      const cheapFlights = flights.filter((f) => f.price <= sub.maxPrice);

      if (cheapFlights.length > 0) {
        const cheapest = cheapFlights[0];
        const priceDiff = sub.maxPrice - cheapest.price;
        const diffPercent = Math.round((priceDiff / sub.maxPrice) * 100);

        const msg = [
          `🔥 *Цена снизилась!*`,
          `✈️ ${sub.originName} → ${sub.destinationName}`,
          `📅 ${sub.departDate}${sub.returnDate ? ` — ${sub.returnDate}` : ''}`,
          ``,
          `💰 *${cheapest.price.toLocaleString('ru-RU')} ${cheapest.currency.toUpperCase()}*`,
          `📉 Экономия: *${priceDiff.toLocaleString('ru-RU')} ${cheapest.currency.toUpperCase()}* (${diffPercent}%)`,
          ``,
          `[🔗 Купить билет](${cheapest.link})`,
          ``,
          `📋 *Всего предложений:* ${cheapFlights.length} в рамках бюджета`,
        ].join('\n');

        await bot.telegram.sendMessage(chatId, msg, {
          parse_mode: 'Markdown',
          link_preview_options: { is_disabled: true },
        });
      }
    } catch (error) {
      console.error(`Monitor error for chat ${chatId}:`, error);
    }
  }
}

if (config.travelpayouts.apiToken) {
  const intervalMs = config.monitor.intervalMinutes * 60 * 1000;
  console.log(`Starting price monitor every ${config.monitor.intervalMinutes} minutes`);
  monitorPrices();
  setInterval(monitorPrices, intervalMs);
} else {
  console.log('No TRAVELPAYOUTS_API_TOKEN set — monitoring disabled');
}

bot.launch().then(() => {
  console.log('TravelBot is running!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

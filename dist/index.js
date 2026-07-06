"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const socks_proxy_agent_1 = require("socks-proxy-agent");
const config_1 = require("./config");
const database_1 = require("./database");
const commands_1 = require("./bot/commands");
const travelpayouts_1 = require("./api/travelpayouts");
const botOptions = {};
if (config_1.config.proxy) {
    botOptions.telegram = { agent: new socks_proxy_agent_1.SocksProxyAgent(config_1.config.proxy) };
    console.log(`Using proxy: ${config_1.config.proxy}`);
}
const bot = new telegraf_1.Telegraf(config_1.config.bot.token, botOptions);
(0, database_1.loadDb)();
(0, commands_1.setupBot)(bot);
async function monitorPrices() {
    console.log(`[${new Date().toISOString()}] Checking prices for all subscriptions...`);
    const allSubs = (0, database_1.getAllSubscriptions)();
    for (const { chatId, sub } of allSubs) {
        try {
            const flights = await (0, travelpayouts_1.searchFlights)({
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
        }
        catch (error) {
            console.error(`Monitor error for chat ${chatId}:`, error);
        }
    }
}
if (config_1.config.travelpayouts.apiToken) {
    const intervalMs = config_1.config.monitor.intervalMinutes * 60 * 1000;
    console.log(`Starting price monitor every ${config_1.config.monitor.intervalMinutes} minutes`);
    monitorPrices();
    setInterval(monitorPrices, intervalMs);
}
else {
    console.log('No TRAVELPAYOUTS_API_TOKEN set — monitoring disabled');
}
bot.launch().then(() => {
    console.log('TravelBot is running!');
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=index.js.map
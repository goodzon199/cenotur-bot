import dotenv from 'dotenv';
dotenv.config();

export const config = {
  bot: {
    token: process.env.BOT_TOKEN || '',
  },
  travelpayouts: {
    apiToken: process.env.TRAVELPAYOUTS_API_TOKEN || '',
    marker: process.env.TRAVELPAYOUTS_MARKER || '',
  },
  db: {
    path: process.env.DB_PATH || './data/users.json',
  },
  monitor: {
    intervalMinutes: parseInt(process.env.MONITOR_INTERVAL_MINUTES || '60', 10),
  },
  proxy: process.env.SOCKS_PROXY || '',
};

if (!config.bot.token) {
  console.error('BOT_TOKEN is required');
  process.exit(1);
}

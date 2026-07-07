import { Telegraf, Context } from 'telegraf';
import { searchFlights } from '../api/travelpayouts';
import { searchHotels, HotelOffer } from '../api/hotels';
import {
  formatFlightsWithCompare,
  formatHotelsList,
  formatSubscriptionInfo,
  formatHotelCompareLinks,
} from '../utils/formatters';
import {
  getSubscriptions,
  addSubscription,
  removeSubscription,
  UserSubscription,
} from '../database';
import { mainKeyboard, searchAgainKeyboard, confirmSubscriptionKeyboard, popularDestinationsKeyboard } from './keyboards';

const CITY_CODES: Record<string, string> = {
  москва: 'MOW', 'санкт-петербург': 'LED', спб: 'LED', сочи: 'AER',
  екатеринбург: 'SVX', новосибирск: 'OVB', казань: 'KZN',
  'нижний новгород': 'GOJ', самара: 'KUF', ростов: 'ROV',
  уфа: 'UFA', красноярск: 'KJA', пермь: 'PEE', воронеж: 'VOZ',
  волгоград: 'VOG', челябинск: 'CEK', омск: 'OMS',
  саратов: 'RTW', тула: 'TYA', краснодар: 'KRR',
  иркутск: 'IKT', хабаровск: 'KHV', владивосток: 'VVO',
  тюмень: 'TJM', астрахань: 'ASF', калининград: 'KGD',
  'химки': 'SVO', 'шеннон': 'SNN',
  'великий новгород': 'NVR', псков: 'PKV',
  мурманск: 'MMK', архангельск: 'ARH',
  ярославль: 'IAR', ижевск: 'IJK',
  томск: 'TOF', кемерово: 'KEJ',
  'набережные челны': 'NBC', ставрополь: 'STW',
  магадан: 'GDX', южносахалинск: 'UUS',
  минск: 'MSQ', гомель: 'GME',
  'алма-ата': 'ALA', алматы: 'ALA',
  нурсултан: 'NQZ', астана: 'NQZ',
  ташкент: 'TAS', бишкек: 'FRU',
  баку: 'GYD', тбилиси: 'TBS', ереван: 'EVN',
  стамбул: 'IST', анталья: 'AYT',
  дубай: 'DXB', абудаби: 'AUH',
  лондон: 'LON', париж: 'PAR', берлин: 'BER',
  прага: 'PRG', барселона: 'BCN',
  милан: 'MIL', рим: 'ROM', венеция: 'VCE',
  никосия: 'ECN', ларнака: 'LCA',
  бангкок: 'BKK', пхукет: 'HKT',
  'гоа': 'GOI', паттайя: 'PYY',
  'оаэ': 'DXB', 'отель': 'DXB',
  тайланд: 'BKK', вьетнам: 'SGN',
  'нью-йорк': 'NYC', 'лос-анджелес': 'LAX',
  майами: 'MIA', чикаго: 'CHI',
  дели: 'DEL', гонконг: 'HKG',
  сингапур: 'SIN', токио: 'TYO',
  пекин: 'BJS', 'шанхай': 'SHA',
  'телль-авив': 'TLV', 'иерусалим': 'JRS',
  доха: 'DOH', манама: 'BAH',
  мале: 'MLE', 'шри-ланка': 'CMB',
  батуми: 'BUS', кутаиси: 'KUT',
  белград: 'BEG', загреб: 'ZAG',
  варшава: 'WAW', будапешт: 'BUD',
  вена: 'VIE', 'царицыно': 'VOG',
};

const CITY_NAMES: Record<string, string> = {
  MOW: 'Москва', LED: 'Санкт-Петербург', AER: 'Сочи',
  SVX: 'Екатеринбург', OVB: 'Новосибирск', KZN: 'Казань',
  GOJ: 'Нижний Новгород', KUF: 'Самара', ROV: 'Ростов-на-Дону',
  UFA: 'Уфа', KJA: 'Красноярск', PEE: 'Пермь', VOZ: 'Воронеж',
  VOG: 'Волгоград', CEK: 'Челябинск', OMS: 'Омск', KRR: 'Краснодар',
  IKT: 'Иркутск', KHV: 'Хабаровск', VVO: 'Владивосток',
  TJM: 'Тюмень', KGD: 'Калининград', MMK: 'Мурманск',
  MSQ: 'Минск', ALA: 'Алматы', NQZ: 'Астана',
  TAS: 'Ташкент', FRU: 'Бишкек', GYD: 'Баку',
  TBS: 'Тбилиси', EVN: 'Ереван', BUS: 'Батуми',
  IST: 'Стамбул', AYT: 'Анталья',
  DXB: 'Дубай', AUH: 'Абу-Даби',
  LON: 'Лондон', PAR: 'Париж', BER: 'Берлин',
  PRG: 'Прага', BCN: 'Барселона', MIL: 'Милан',
  ROM: 'Рим', VCE: 'Венеция', BEG: 'Белград',
  WAW: 'Варшава', BUD: 'Будапешт', VIE: 'Вена',
  BKK: 'Бангкок', HKT: 'Пхукет', GOI: 'Гоа',
  NYC: 'Нью-Йорк', LAX: 'Лос-Анджелес', MIA: 'Майами',
  DEL: 'Дели', HKG: 'Гонконг', SIN: 'Сингапур',
  TYO: 'Токио', BJS: 'Пекин',
  TLV: 'Тель-Авив', DOH: 'Доха',
  MLE: 'Мале', CMB: 'Коломбо',
};

function resolveCity(input: string): string | null {
  const clean = input.toLowerCase().trim();
  if (CITY_CODES[clean]) return CITY_CODES[clean];
  if (/^[A-Z]{3}$/.test(clean.toUpperCase())) return clean.toUpperCase();
  return null;
}

const userSessions = new Map<
  number,
  {
    step: string;
    origin?: string;
    destination?: string;
    departDate?: string;
    returnDate?: string;
    maxPrice?: number;
  }
>();

export function setupBot(bot: Telegraf) {
  bot.start(async (ctx) => {
    const name = ctx.from?.first_name || 'Путник';
    await ctx.reply(
      `👋 Привет, ${name}!\n\n`
        + 'Я — *TravelBot* 🧳\n'
        + 'Ищу лучшие цены на авиабилеты и отели.\n\n'
        + '📌 *Команды:*\n'
        + '/flights — 🔍 Поиск авиабилетов\n'
        + '/hotels — 🏨 Поиск отелей\n'
        + '/subscribe — 📋 Подписаться на мониторинг цен\n'
        + '/mysubs — 📋 Мои подписки\n'
        + '/unsubscribe — ❌ Отписаться\n'
        + '/help — ❓ Помощь',
      { parse_mode: 'Markdown' },
    );
  });

  bot.help(async (ctx) => {
    await ctx.reply(
      '🧳 *TravelBot — Помощь*\n\n'
        + '🔍 *Поиск авиабилетов:* /flights\n'
        + '🏨 *Поиск отелей:* /hotels\n'
        + '📋 *Мониторинг цен:* /subscribe\n'
        + '   — бот будет следить за ценой и уведомлять\n'
        + '📋 *Мои подписки:* /mysubs\n'
        + '❌ *Удалить подписку:* /unsubscribe\n\n'
        + '💎 *Как это работает:*\n'
        + 'Я ищу лучшие цены через партнёрские API.\n'
        + 'Переход по ссылкам помогает проекту развиваться 🙌',
      { parse_mode: 'Markdown' },
    );
  });

  bot.command('flights', async (ctx) => {
    userSessions.set(ctx.chat.id, { step: 'awaiting_origin' });
    await ctx.reply('✈️ Введите город *отправления* (например: Москва, LED, СПб):', {
      parse_mode: 'Markdown',
    });
  });

  bot.command('hotels', async (ctx) => {
    userSessions.set(ctx.chat.id, { step: 'awaiting_hotel_city' });
    await ctx.reply('🏨 Введите *город* для поиска отелей (например: Сочи, Стамбул):', {
      parse_mode: 'Markdown',
    });
  });

  bot.command('subscribe', async (ctx) => {
    userSessions.set(ctx.chat.id, { step: 'awaiting_origin' });
    await ctx.reply(
      '📋 *Настройка мониторинга цен*\n\n'
        + 'Введите город *отправления* (например: Москва, LED):',
      { parse_mode: 'Markdown' },
    );
  });

  bot.command('mysubs', async (ctx) => {
    const subs = getSubscriptions(ctx.chat.id);
    if (subs.length === 0) {
      await ctx.reply(
        '📋 У вас нет активных подписок.\n'
          + 'Используйте /subscribe чтобы создать.',
      );
      return;
    }
    const msg = subs
      .map((s, i) =>
        formatSubscriptionInfo({
          originName: s.originName,
          destinationName: s.destinationName,
          departDate: s.departDate,
          returnDate: s.returnDate,
          maxPrice: s.maxPrice,
          currency: s.currency,
          index: i,
        }),
      )
      .join('\n\n');
    await ctx.reply(`📋 *Ваши подписки:*\n\n${msg}`, { parse_mode: 'Markdown' });
  });

  bot.command('unsubscribe', async (ctx) => {
    const subs = getSubscriptions(ctx.chat.id);
    if (subs.length === 0) {
      await ctx.reply('У вас нет активных подписок.');
      return;
    }
    const msg = subs
      .map((s, i) => `${i + 1}. ${s.originName} → ${s.destinationName} (${s.departDate})`)
      .join('\n');
    await ctx.reply(
      `❌ Введите номер подписки для удаления:\n\n${msg}\n\n`
        + 'Или отправьте /cancel для отмены.',
    );
    userSessions.set(ctx.chat.id, { step: 'awaiting_unsub_index' });
  });

  bot.hears(/^\/?cancel$/i, async (ctx) => {
    userSessions.delete(ctx.chat.id);
    await ctx.reply('❌ Отменено.', mainKeyboard);
  });

  bot.hears('🔥 Популярные направления', async (ctx) => {
    await ctx.reply('Выберите популярное направление:', {
      parse_mode: 'Markdown',
      ...popularDestinationsKeyboard(),
    });
  });

  bot.on('text', async (ctx) => {
    const session = userSessions.get(ctx.chat.id);
    if (!session) {
      await ctx.reply(
        'Используйте /flights для поиска или /help для помощи.',
        mainKeyboard,
      );
      return;
    }

    const text = ctx.message.text.trim();

    switch (session.step) {
      case 'awaiting_origin': {
        const code = resolveCity(text);
        if (!code) {
          await ctx.reply(
            '❌ Не удалось распознать город. Попробуйте снова (например: Москва, LED):',
          );
          return;
        }
        session.origin = code;
        session.step = 'awaiting_destination';
        await ctx.reply('✈️ Введите город *назначения* (например: Стамбул, Сочи, AER):', {
          parse_mode: 'Markdown',
        });
        break;
      }

      case 'awaiting_destination': {
        const code = resolveCity(text);
        if (!code) {
          await ctx.reply('❌ Не удалось распознать город. Попробуйте снова:');
          return;
        }
        session.destination = code;
        session.step = 'awaiting_depart_date';
        await ctx.reply(
          '📅 Введите дату *отправления* в формате ДД.ММ.ГГГГ (например: 15.08.2026):',
          { parse_mode: 'Markdown' },
        );
        break;
      }

      case 'awaiting_depart_date': {
        const dateMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (!dateMatch) {
          await ctx.reply('❌ Неверный формат. Используйте ДД.ММ.ГГГГ (например: 15.08.2026):');
          return;
        }
        session.departDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;

        if (ctx.message.text?.toLowerCase().includes('subscribe')) {
          session.step = 'awaiting_price';
          await ctx.reply(
            '💰 Введите *максимальную цену* в рублях (например: 15000):',
            { parse_mode: 'Markdown' },
          );
        } else {
          session.step = 'awaiting_return_date';
          await ctx.reply(
            '📅 Если нужен *обратный билет*, введите дату возвращения (ДД.ММ.ГГГГ)\n'
              + 'Или отправьте "нет" для поиска в одну сторону:',
            { parse_mode: 'Markdown' },
          );
        }
        break;
      }

      case 'awaiting_return_date': {
        const textLower = text.toLowerCase();
        if (textLower === 'нет' || textLower === 'no' || textLower === '-' || textLower === '0') {
          session.returnDate = undefined;
        } else {
          const dateMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
          if (!dateMatch) {
            await ctx.reply('❌ Неверный формат. Введите дату (ДД.ММ.ГГГГ) или "нет":');
            return;
          }
          session.returnDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
        }
        session.step = 'searching';
        await performFlightSearch(ctx, session);
        break;
      }

      case 'awaiting_price': {
        const price = parseInt(text.replace(/\s/g, ''), 10);
        if (isNaN(price) || price <= 0) {
          await ctx.reply('❌ Введите корректную сумму в рублях (например: 15000):');
          return;
        }
        session.maxPrice = price;
        session.step = 'confirm_sub';
        const sub = session as Required<typeof session>;
        await ctx.reply(
          '📋 *Подтверждение подписки:*\n\n'
            + `✈️ ${CITY_NAMES[sub.origin!] || sub.origin} → ${CITY_NAMES[sub.destination!] || sub.destination}\n`
            + `📅 ${sub.departDate}\n`
            + `💰 до *${sub.maxPrice!.toLocaleString('ru-RU')} RUB*\n\n`
            + 'Я буду проверять цены каждый час и уведомлять о лучших предложениях.',
          { parse_mode: 'Markdown', ...confirmSubscriptionKeyboard() },
        );
        break;
      }

      case 'confirm_sub': {
        break;
      }

      case 'awaiting_hotel_city': {
        const code = resolveCity(text);
        if (!code) {
          await ctx.reply('❌ Не удалось распознать город. Попробуйте снова:');
          return;
        }
        session.destination = code;
        session.step = 'awaiting_hotel_checkin';
        await ctx.reply('📅 Введите дату *заезда* (ДД.ММ.ГГГГ):', { parse_mode: 'Markdown' });
        break;
      }

      case 'awaiting_hotel_checkin': {
        const dateMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (!dateMatch) {
          await ctx.reply('❌ Неверный формат. Используйте ДД.ММ.ГГГГ:');
          return;
        }
        session.departDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
        session.step = 'awaiting_hotel_checkout';
        await ctx.reply('📅 Введите дату *выезда* (ДД.ММ.ГГГГ):', { parse_mode: 'Markdown' });
        break;
      }

      case 'awaiting_hotel_checkout': {
        const dateMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (!dateMatch) {
          await ctx.reply('❌ Неверный формат. Используйте ДД.ММ.ГГГГ:');
          return;
        }
        session.returnDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
        session.step = 'searching';
        await performHotelSearch(ctx, session);
        break;
      }

      case 'awaiting_unsub_index': {
        const index = parseInt(text, 10) - 1;
        const subs = getSubscriptions(ctx.chat.id);
        if (isNaN(index) || index < 0 || index >= subs.length) {
          await ctx.reply('❌ Неверный номер. Попробуйте снова:');
          return;
        }
        const sub = subs[index];
        removeSubscription(ctx.chat.id, index);
        userSessions.delete(ctx.chat.id);
        await ctx.reply(
          `✅ Подписка *${sub.originName} → ${sub.destinationName}* удалена.`,
          { parse_mode: 'Markdown' },
        );
        break;
      }

      default:
        if (ctx.chat) userSessions.delete(ctx.chat.id);
        await ctx.reply('Используйте /flights для поиска.', mainKeyboard);
    }
  });

  function chatId(ctx: Context): number | undefined {
    if (!ctx.chat) return undefined;
    if (ctx.chat.type === 'private') return ctx.chat.id;
    return undefined;
  }

  const POPULAR: Record<string, { origin: string; dest: string }> = {
    pop_MOW_LED: { origin: 'MOW', dest: 'LED' },
    pop_MOW_AER: { origin: 'MOW', dest: 'AER' },
    pop_MOW_IST: { origin: 'MOW', dest: 'IST' },
    pop_MOW_DXB: { origin: 'MOW', dest: 'DXB' },
    pop_LED_MOW: { origin: 'LED', dest: 'MOW' },
    pop_MOW_AYT: { origin: 'MOW', dest: 'AYT' },
    pop_MOW_EVN: { origin: 'MOW', dest: 'EVN' },
    pop_MOW_GYD: { origin: 'MOW', dest: 'GYD' },
    pop_MOW_TAS: { origin: 'MOW', dest: 'TAS' },
    pop_MOW_SVX: { origin: 'MOW', dest: 'SVX' },
  };

  bot.action(/pop_/, async (ctx) => {
    const cid = chatId(ctx);
    if (!cid) return;
    const route = POPULAR[ctx.match[0]];
    if (!route) return;
    userSessions.set(cid, {
      step: 'awaiting_depart_date',
      origin: route.origin,
      destination: route.dest,
    });
    const from = CITY_NAMES[route.origin] || route.origin;
    const to = CITY_NAMES[route.dest] || route.dest;
    await ctx.editMessageText(
      `✈️ *${from} → ${to}*\n\n📅 Введите дату *отправления* (ДД.ММ.ГГГГ):`,
      { parse_mode: 'Markdown' },
    );
  });

  bot.action('sub_confirm', async (ctx) => {
    const cid = chatId(ctx);
    if (!cid) return;
    const session = userSessions.get(cid);
    if (!session?.origin || !session?.destination || !session?.departDate || !session.maxPrice) {
      await ctx.answerCbQuery('❌ Сессия истекла. Начните заново.');
      return;
    }

    const sub: UserSubscription = {
      chatId: cid,
      originIata: session.origin,
      originName: CITY_NAMES[session.origin] || session.origin,
      destinationIata: session.destination,
      destinationName: CITY_NAMES[session.destination] || session.destination,
      departDate: session.departDate,
      returnDate: session.returnDate,
      maxPrice: session.maxPrice,
      currency: 'RUB',
      createdAt: new Date().toISOString(),
    };

    addSubscription(cid, sub);
    userSessions.delete(cid);

    await ctx.editMessageText(
      '✅ *Подписка создана!*\n\n'
        + `✈️ ${sub.originName} → ${sub.destinationName}\n`
        + `📅 ${sub.departDate}\n`
        + `💰 до *${sub.maxPrice.toLocaleString('ru-RU')} RUB*\n\n`
        + '🔔 Я буду уведомлять вас, когда цена упадёт ниже этого порога.',
      { parse_mode: 'Markdown' },
    );
  });

  bot.action('sub_cancel', async (ctx) => {
    const cid = chatId(ctx);
    if (cid) userSessions.delete(cid);
    await ctx.editMessageText('❌ Подписка отменена.', { parse_mode: 'Markdown' });
  });

  bot.action('new_search', async (ctx) => {
    const cid = chatId(ctx);
    if (cid) userSessions.set(cid, { step: 'awaiting_origin' });
    await ctx.reply('✈️ Введите город *отправления*:', { parse_mode: 'Markdown' });
  });

  bot.action('my_subs', async (ctx) => {
    const cid = chatId(ctx);
    if (!cid) return;
    const subs = getSubscriptions(cid);
    if (subs.length === 0) {
      await ctx.reply('📋 У вас нет активных подписок.');
      return;
    }
    const msg = subs
      .map((s, i) => formatSubscriptionInfo({ ...s, index: i }))
      .join('\n\n');
    await ctx.reply(`📋 *Ваши подписки:*\n\n${msg}`, { parse_mode: 'Markdown' });
  });
}

async function performFlightSearch(ctx: Context, session: { origin?: string; destination?: string; departDate?: string; returnDate?: string }) {
  if (!session.origin || !session.destination || !session.departDate) {
    await ctx.reply('❌ Ошибка: не все параметры указаны. Начните заново /flights');
    return;
  }
  await ctx.reply('🔍 Ищу лучшие цены...', { parse_mode: 'Markdown' });

  try {
    const flights = await searchFlights({
      origin: session.origin,
      destination: session.destination,
      departDate: session.departDate,
      returnDate: session.returnDate,
    });

    if (flights.length === 0) {
      await ctx.reply(
        '😔 Билеты не найдены. Попробуйте:\n'
          + '• Другие даты\n'
          + '• Другое направление\n'
          + '• /flights — новый поиск',
        searchAgainKeyboard(),
      );
      return;
    }

    const msg = formatFlightsWithCompare(flights, {
      origin: session.origin,
      destination: session.destination,
      departDate: session.departDate,
      returnDate: session.returnDate,
    });

    await ctx.reply(msg, { parse_mode: 'Markdown', link_preview_options: { is_disabled: true }, ...searchAgainKeyboard() });
  } catch (error) {
    console.error('Search error:', error);
    await ctx.reply('❌ Произошла ошибка при поиске. Попробуйте позже.');
  }

  if (ctx.chat) userSessions.delete(ctx.chat.id);
}

async function performHotelSearch(
  ctx: Context,
  session: { destination?: string; departDate?: string; returnDate?: string },
) {
  if (!session.destination || !session.departDate || !session.returnDate) {
    await ctx.reply('❌ Ошибка: не все параметры указаны. Начните заново /hotels');
    return;
  }
  await ctx.reply('🔍 Ищу лучшие отели...');

  try {
    const hotels = await searchHotels({
      location: session.destination,
      checkIn: session.departDate,
      checkOut: session.returnDate,
    });

    if (hotels.length === 0) {
      await ctx.reply(
        '😔 Отели не найдены. Попробуйте другие даты или направление.',
        searchAgainKeyboard(),
      );
      return;
    }

    const msg = formatHotelsList(
      hotels,
      `📍 Отели в ${CITY_NAMES[session.destination] || session.destination}`,
    );

    await ctx.reply(msg, { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } });

    const compareMsg = formatHotelCompareLinks({
      city: session.destination,
      checkIn: session.departDate,
      checkOut: session.returnDate,
    });
    await ctx.reply(compareMsg, { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } });

    await ctx.reply(
      '💎 Переход по ссылкам помогает проекту 🙌',
      { ...searchAgainKeyboard() },
    );
  } catch (error) {
    console.error('Hotel search error:', error);
    await ctx.reply('❌ Произошла ошибка при поиске отелей.');
  }

  if (ctx.chat) userSessions.delete(ctx.chat.id);
}

export { CITY_NAMES };

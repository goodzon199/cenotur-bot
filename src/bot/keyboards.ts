import { Markup } from 'telegraf';

export const mainKeyboard = Markup.keyboard([
  ['🔍 Поиск авиабилетов', '🏨 Поиск отелей'],
  ['📋 Мои подписки', '❌ Отписаться'],
  ['🔥 Популярные направления', '❓ Помощь'],
]).resize();

export function searchAgainKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback('🔍 Новый поиск', 'new_search'),
    Markup.button.callback('📋 Мои подписки', 'my_subs'),
  ]);
}

export function confirmSubscriptionKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback('✅ Подписаться на мониторинг', 'sub_confirm'),
    Markup.button.callback('❌ Отмена', 'sub_cancel'),
  ]);
}

export function popularDestinationsKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('Москва → СПб', 'pop_MOW_LED'),
      Markup.button.callback('Москва → Сочи', 'pop_MOW_AER'),
    ],
    [
      Markup.button.callback('Москва → Стамбул', 'pop_MOW_IST'),
      Markup.button.callback('Москва → Дубай', 'pop_MOW_DXB'),
    ],
    [
      Markup.button.callback('СПб → Москва', 'pop_LED_MOW'),
      Markup.button.callback('Москва → Анталья', 'pop_MOW_AYT'),
    ],
    [
      Markup.button.callback('Москва → Ереван', 'pop_MOW_EVN'),
      Markup.button.callback('Москва → Баку', 'pop_MOW_GYD'),
    ],
    [
      Markup.button.callback('Москва → Ташкент', 'pop_MOW_TAS'),
      Markup.button.callback('Москва → Екатеринбург', 'pop_MOW_SVX'),
    ],
  ]);
}

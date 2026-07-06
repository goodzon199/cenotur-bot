import { Markup } from 'telegraf';

export const mainKeyboard = Markup.keyboard([
  ['🔍 Поиск авиабилетов', '🏨 Поиск отелей'],
  ['📋 Мои подписки', '❌ Отписаться'],
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

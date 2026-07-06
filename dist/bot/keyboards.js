"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainKeyboard = void 0;
exports.searchAgainKeyboard = searchAgainKeyboard;
exports.confirmSubscriptionKeyboard = confirmSubscriptionKeyboard;
const telegraf_1 = require("telegraf");
exports.mainKeyboard = telegraf_1.Markup.keyboard([
    ['🔍 Поиск авиабилетов', '🏨 Поиск отелей'],
    ['📋 Мои подписки', '❌ Отписаться'],
]).resize();
function searchAgainKeyboard() {
    return telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('🔍 Новый поиск', 'new_search'),
        telegraf_1.Markup.button.callback('📋 Мои подписки', 'my_subs'),
    ]);
}
function confirmSubscriptionKeyboard() {
    return telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('✅ Подписаться на мониторинг', 'sub_confirm'),
        telegraf_1.Markup.button.callback('❌ Отмена', 'sub_cancel'),
    ]);
}
//# sourceMappingURL=keyboards.js.map
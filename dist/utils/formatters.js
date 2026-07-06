"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFlight = formatFlight;
exports.formatFlightsList = formatFlightsList;
exports.formatHotel = formatHotel;
exports.formatHotelsList = formatHotelsList;
exports.formatSubscriptionInfo = formatSubscriptionInfo;
const AIRLINE_NAMES = {
    SU: 'Аэрофлот',
    S7: 'S7 Airlines',
    UT: 'ЮТэйр',
    U6: 'Уральские авиалинии',
    DP: 'Победа',
    TK: 'Turkish Airlines',
    EK: 'Emirates',
    QR: 'Qatar Airways',
    EY: 'Etihad',
    LH: 'Lufthansa',
    AF: 'Air France',
    BA: 'British Airways',
};
function formatFlight(flight) {
    const airline = AIRLINE_NAMES[flight.airline] || flight.airline;
    const changes = flight.direct ? '✈️ Прямой' : '🔄 С пересадкой';
    const price = flight.price.toLocaleString('ru-RU');
    return [
        `✈️ *${flight.originName} → ${flight.destinationName}*`,
        `🗓 ${flight.departDate}${flight.returnDate ? ` — ${flight.returnDate}` : ''}`,
        `💵 *${price} ${flight.currency.toUpperCase()}*`,
        `🏢 ${airline} (рейс ${flight.flightNumber})`,
        `📌 ${changes}`,
        ``,
        `[🔗 Посмотреть и купить](${flight.link})`,
    ].join('\n');
}
function formatFlightsList(flights, title) {
    if (flights.length === 0) {
        return '😔 Билеты не найдены. Попробуйте изменить параметры поиска.';
    }
    const header = `🎯 *${title}*\n\n`;
    const items = flights.map((f, i) => `*${i + 1}.* ${formatFlight(f)}`).join('\n\n---\n\n');
    return header + items;
}
function formatHotel(hotel) {
    const stars = '⭐'.repeat(hotel.stars);
    const price = hotel.price.toLocaleString('ru-RU');
    return [
        `🏨 *${hotel.hotelName}* ${stars}`,
        `📍 ${hotel.location}`,
        `📅 ${hotel.checkIn} — ${hotel.checkOut}`,
        `💵 *${price} ${hotel.currency.toUpperCase()}*`,
        ``,
        `[🔗 Посмотреть и забронировать](${hotel.link})`,
    ].join('\n');
}
function formatHotelsList(hotels, title) {
    if (hotels.length === 0) {
        return '😔 Отели не найдены. Попробуйте изменить параметры поиска.';
    }
    const header = `🎯 *${title}*\n\n`;
    const items = hotels.map((h, i) => `*${i + 1}.* ${formatHotel(h)}`).join('\n\n---\n\n');
    return header + items;
}
function formatSubscriptionInfo(sub) {
    const returnStr = sub.returnDate ? ` — ${sub.returnDate}` : '';
    const price = sub.maxPrice.toLocaleString('ru-RU');
    return [
        `*${sub.index + 1}.* ${sub.originName} → ${sub.destinationName}`,
        `📅 ${sub.departDate}${returnStr}`,
        `💰 до *${price} ${sub.currency.toUpperCase()}*`,
    ].join('\n');
}
//# sourceMappingURL=formatters.js.map
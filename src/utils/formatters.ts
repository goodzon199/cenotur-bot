import { FlightOffer } from '../api/travelpayouts';
import { HotelOffer } from '../api/hotels';

const AIRLINE_NAMES: Record<string, string> = {
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

export function formatFlight(flight: FlightOffer): string {
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

export function formatFlightsList(flights: FlightOffer[], title: string): string {
  if (flights.length === 0) {
    return '😔 Билеты не найдены. Попробуйте изменить параметры поиска.';
  }

  const header = `🎯 *${title}*\n\n`;
  const items = flights.map((f, i) => `*${i + 1}.* ${formatFlight(f)}`).join('\n\n---\n\n');
  return header + items;
}

export function formatHotel(hotel: HotelOffer): string {
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

export function formatHotelsList(hotels: HotelOffer[], title: string): string {
  if (hotels.length === 0) {
    return '😔 Отели не найдены. Попробуйте изменить параметры поиска.';
  }

  const header = `🎯 *${title}*\n\n`;
  const items = hotels.map((h, i) => `*${i + 1}.* ${formatHotel(h)}`).join('\n\n---\n\n');
  return header + items;
}

export function formatSubscriptionInfo(sub: {
  originName: string;
  destinationName: string;
  departDate: string;
  returnDate?: string;
  maxPrice: number;
  currency: string;
  index: number;
}): string {
  const returnStr = sub.returnDate ? ` — ${sub.returnDate}` : '';
  const price = sub.maxPrice.toLocaleString('ru-RU');

  return [
    `*${sub.index + 1}.* ${sub.originName} → ${sub.destinationName}`,
    `📅 ${sub.departDate}${returnStr}`,
    `💰 до *${price} ${sub.currency.toUpperCase()}*`,
  ].join('\n');
}

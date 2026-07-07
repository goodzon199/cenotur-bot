import { FlightOffer } from '../api/travelpayouts';
import { HotelOffer } from '../api/hotels';
import { aviasalesUrl, tripComFlightUrl, oneTwoTripUrl, ostrovokUrl, tripComHotelUrl } from '../api/partners';
import { config } from '../config';

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
  const gate = flight.gate ? ` 🛒 ${flight.gate}` : '';

  return [
    `✈️ *${flight.originName} → ${flight.destinationName}*`,
    `🗓 ${flight.departDate}${flight.returnDate ? ` — ${flight.returnDate}` : ''}`,
    `💵 *${price} ${flight.currency.toUpperCase()}*${gate}`,
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
  const items = flights.slice(0, 2).map((f, i) => `${i === 0 ? '🥇' : '🥈'} ${formatFlight(f)}`).join('\n\n');
  return header + items;
}

export function formatFlightsWithCompare(flights: FlightOffer[], compareParams: {
  origin: string; destination: string; departDate: string
}): string {
  if (flights.length === 0) {
    return '😔 Билеты не найдены. Попробуйте изменить параметры поиска.';
  }

  const header = `🎯 *${compareParams.origin === 'MOW' ? 'Москва' : compareParams.origin} → ${compareParams.destination === 'LED' ? 'Санкт-Петербург' : compareParams.destination}*\n\n`;

  const top = flights.slice(0, 2).map((f, i) => `${i === 0 ? '🥇' : '🥈'} ${formatFlight(f)}`).join('\n\n');

  const aviaLink = aviasalesUrl(compareParams);
  const tripLink = tripComFlightUrl(compareParams);
  const ottLink = oneTwoTripUrl(compareParams);

  const compare = [
    '',
    '📊 *Где ещё посмотреть:*',
    `[✈️ Aviasales](${aviaLink}) · [🧳 OneTwoTrip](${ottLink}) · [🌍 Trip.com](${tripLink})`,
  ].join('\n');

  return header + top + compare;
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

export function formatFlightCompareLinks(params: {
  origin: string; destination: string; departDate: string
}): string {
  const avia = tripComFlightUrl(params);
  const ott = oneTwoTripUrl(params);
  return [
    '📊 *Сравнить цены:*',
    `[✈️ Aviasales](${avia}) · [🧳 OneTwoTrip](${ott})`,
  ].join('\n');
}

export function formatHotelCompareLinks(params: {
  city: string; checkIn: string; checkOut: string
}): string {
  const trip = tripComHotelUrl(params);
  const ost = ostrovokUrl(params);
  return [
    '📊 *Сравнить цены:*',
    `[🏨 Trip.com](${trip}) · [🏨 Ostrovok](${ost})`,
  ].join('\n');
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

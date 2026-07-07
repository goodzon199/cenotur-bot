import { FlightOffer } from '../api/travelpayouts';
import { HotelOffer } from '../api/hotels';
import { tripComFlightUrl, oneTwoTripUrl, ostrovokUrl, tripComHotelUrl } from '../api/partners';

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
  origin: string; destination: string; departDate: string; returnDate?: string
}): string {
  const originName = compareParams.origin === 'MOW' ? 'Москва' : compareParams.origin;
  const destName = compareParams.destination === 'LED' ? 'Санкт-Петербург' : compareParams.destination;

  let msg = `🎯 *${originName} → ${destName}*\n\n`;

  if (flights.length === 0) {
    msg += '😔 Билеты не найдены. Попробуйте другие даты.';
    return msg;
  }

  function flightLine(f: FlightOffer, label: string): string {
    const dates = f.returnDate ? `📅 ${f.departDate} — ${f.returnDate}` : `📅 ${f.departDate}`;
    const price = f.price.toLocaleString('ru-RU');
    const ch = f.direct ? '✈️ Прямой' : '🔄 С пересадкой';
    const g = f.gate ? ` · 🛒 ${f.gate}` : '';
    return `${label} *Aviasales* — *${price} ₽*\n${dates}\n🏢 ${f.airline}${g} · ${ch}\n[🔗 Купить билет](${f.link})`;
  }

  msg += flightLine(flights[0], '🥇') + '\n\n';

  const gates: Record<string, FlightOffer> = {};
  for (const f of flights) {
    if (f.gate && !gates[f.gate] && f !== flights[0]) gates[f.gate] = f;
  }

  const gateKeys = Object.keys(gates);
  if (gateKeys.length > 0) {
    msg += flightLine(gates[gateKeys[0]], '🥈').replace('*Aviasales*', `*${gates[gateKeys[0]].gate}*`) + '\n\n';
  }
  if (gateKeys.length > 1) {
    msg += flightLine(gates[gateKeys[1]], '🥉').replace('*Aviasales*', `*${gates[gateKeys[1]].gate}*`) + '\n\n';
  }

  const tripLink = tripComFlightUrl(compareParams);
  msg += `🌍 *Ещё варианты:* [Trip.com](${tripLink}) · [OneTwoTrip](${oneTwoTripUrl(compareParams)})`;

  return msg;
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

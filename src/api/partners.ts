import { config } from '../config';

function toDDMMYY(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}${m}${y.slice(2)}`;
}

function m(): string {
  return config.travelpayouts.marker ? `marker=${config.travelpayouts.marker}` : '';
}

export function aviasalesUrl(params: { origin: string; destination: string; departDate: string }): string {
  const date = toDDMMYY(params.departDate);
  const mk = m();
  return `https://www.aviasales.ru/search/${params.origin}${date}${params.destination}1?${mk}`;
}

export function oneTwoTripUrl(params: { origin: string; destination: string; departDate: string }): string {
  const date = toDDMMYY(params.departDate);
  const mk = m();
  return `https://www.onetwotrip.com/?${mk}&from=${params.origin}&to=${params.destination}&departureDate=${date}`;
}

export function tripComFlightUrl(params: { origin: string; destination: string; departDate: string }): string {
  const date = toDDMMYY(params.departDate);
  const mk = m();
  return `https://search.trip.com/flights/${params.origin}-to-${params.destination}?depart=${date}&currency=RUB&${mk}`;
}

export function tripComHotelUrl(params: { city: string; checkIn: string; checkOut: string }): string {
  const mk = m();
  return `https://search.trip.com/hotels/${params.city}?checkin=${params.checkIn}&checkout=${params.checkOut}&currency=RUB&${mk}`;
}

export function ostrovokUrl(params: { city: string; checkIn: string; checkOut: string }): string {
  const mk = m();
  return `https://ostrovok.ru/search/${params.city}/?checkIn=${params.checkIn}&checkOut=${params.checkOut}&${mk}`;
}

import { config } from '../config';

function toDDMMYY(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}${m}${y.slice(2)}`;
}

function m(): string {
  return config.travelpayouts.marker ? `marker=${config.travelpayouts.marker}` : '';
}

export interface SearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
}

export function aviasalesUrl(params: SearchParams): string {
  const out = toDDMMYY(params.departDate);
  const ret = params.returnDate ? `/${toDDMMYY(params.returnDate)}` : '';
  const mk = m();
  return `https://www.aviasales.ru/search/${params.origin}${out}${params.destination}1${ret}?${mk}`;
}

export function oneTwoTripUrl(params: SearchParams): string {
  const out = toDDMMYY(params.departDate);
  const ret = params.returnDate ? `&returnDate=${toDDMMYY(params.returnDate)}` : '';
  const mk = m();
  return `https://www.onetwotrip.com/?${mk}&from=${params.origin}&to=${params.destination}&departureDate=${out}${ret}`;
}

export function tripComFlightUrl(params: SearchParams): string {
  const out = toDDMMYY(params.departDate);
  const ret = params.returnDate ? `&return=${toDDMMYY(params.returnDate)}` : '';
  const mk = m();
  return `https://search.trip.com/flights/${params.origin}-to-${params.destination}?depart=${out}${ret}&currency=RUB&${mk}`;
}

export function tripComHotelUrl(params: { city: string; checkIn: string; checkOut: string }): string {
  const mk = m();
  return `https://search.trip.com/hotels/${params.city}?checkin=${params.checkIn}&checkout=${params.checkOut}&currency=RUB&${mk}`;
}

export function ostrovokUrl(params: { city: string; checkIn: string; checkOut: string }): string {
  const mk = m();
  return `https://ostrovok.ru/search/${params.city}/?checkIn=${params.checkIn}&checkOut=${params.checkOut}&${mk}`;
}

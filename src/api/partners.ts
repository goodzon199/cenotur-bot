import { config } from '../config';

function m(marker: string): string {
  return config.travelpayouts.marker ? `marker=${config.travelpayouts.marker}` : '';
}

export function tripComFlightUrl(params: { origin: string; destination: string; departDate: string }): string {
  const d = params.departDate.replace(/-/g, '');
  const mk = m(config.travelpayouts.marker);
  return `https://search.trip.com/flights/${params.origin}-to-${params.destination}?depart=${d}&${mk}`;
}

export function tripComHotelUrl(params: { city: string; checkIn: string; checkOut: string }): string {
  const mk = m(config.travelpayouts.marker);
  return `https://search.trip.com/hotels/${params.city}?checkin=${params.checkIn}&checkout=${params.checkOut}&${mk}`;
}

export function oneTwoTripUrl(params: { origin: string; destination: string; departDate: string }): string {
  const d = params.departDate.replace(/-/g, '');
  const mk = m(config.travelpayouts.marker);
  return `https://www.onetwotrip.com/Flights?from=${params.origin}&to=${params.destination}&departureDate=${d}&${mk}`;
}

export function ostrovokUrl(params: { city: string; checkIn: string; checkOut: string }): string {
  const mk = m(config.travelpayouts.marker);
  return `https://ostrovok.ru/search/${params.city}/?checkIn=${params.checkIn}&checkOut=${params.checkOut}&${mk}`;
}

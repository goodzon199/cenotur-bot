import axios from 'axios';
import { config } from '../config';

const API_BASE = 'https://api.travelpayouts.com/aviasales/v3';

export interface FlightOffer {
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  departDate: string;
  returnDate?: string;
  price: number;
  currency: string;
  airline: string;
  flightNumber: string;
  link: string;
  direct: boolean;
  gate?: string;
}

interface FlightRaw {
  flight_number: string;
  link: string;
  origin_airport: string;
  destination_airport: string;
  departure_at: string;
  airline: string;
  destination: string;
  origin: string;
  price: number;
  gate: string;
  transfers: number;
  duration: number;
  return_transfers: number;
}

interface PriceResponse {
  success: boolean;
  data: FlightRaw[];
  currency: string;
}

export function buildAffiliateLink(params: {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
}): string {
  const marker = config.travelpayouts.marker;
  const base = 'https://www.aviasales.ru/search';
  const d = params.departDate.replace(/-/g, '');
  const search = `${params.origin}${d}${params.destination}1`;
  return `${base}/${search}?marker=${marker}`;
}

function parseFlight(p: FlightRaw, currency: string): FlightOffer {
  const departDate = p.departure_at.slice(0, 10);
  const searchUrl = p.link.startsWith('http') ? p.link : `https://www.aviasales.ru${p.link}`;
  const marker = config.travelpayouts.marker;
  const link = marker ? `${searchUrl}${p.link.includes('?') ? '&' : '?'}marker=${marker}` : searchUrl;
  return {
    origin: p.origin,
    destination: p.destination,
    originName: p.origin_airport,
    destinationName: p.destination_airport,
    departDate,
    price: p.price,
    currency,
    airline: p.airline,
    flightNumber: p.flight_number,
    link,
    direct: p.transfers === 0,
    gate: p.gate,
  };
}

export async function searchFlights(params: {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  currency?: string;
}): Promise<FlightOffer[]> {
  try {
    const response = await axios.get<PriceResponse>(`${API_BASE}/prices_for_dates`, {
      params: {
        token: config.travelpayouts.apiToken,
        origin: params.origin,
        destination: params.destination,
        depart_date: params.departDate,
        return_date: params.returnDate || '',
        currency: params.currency || 'rub',
        one_way: params.returnDate ? false : true,
        sorting: 'price',
        direct: false,
        limit: 10,
      },
    });

    if (!response.data.success || !response.data.data?.length) {
      return [];
    }

    return response.data.data.map((p) => parseFlight(p, response.data.currency));
  } catch (error) {
    console.error('Travelpayouts API error:', error);
    return [];
  }
}

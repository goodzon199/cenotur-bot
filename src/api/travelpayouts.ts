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
}

export interface PriceResponse {
  success: boolean;
  data?: {
    best_prices: Array<{
      origin_airport: string;
      destination_airport: string;
      origin: string;
      destination: string;
      depart_date: string;
      return_date: string;
      airline: string;
      flight_number: string;
      price: number;
      currency: string;
      actual: boolean;
      number_of_changes: number;
    }>;
  };
  error?: string;
}

export function buildAffiliateLink(params: {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  marker?: string;
}): string {
  const marker = params.marker || config.travelpayouts.marker;
  const base = 'https://www.aviasales.ru/search';
  const search = `${params.origin}${params.departDate.replace(/-/g, '')}${params.destination}1`;
  const utm = `?marker=${marker}`;
  return `${base}/${search}${utm}`;
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
      },
    });

    if (!response.data.success || !response.data.data?.best_prices) {
      return [];
    }

    return response.data.data.best_prices.map((p) => ({
      origin: p.origin,
      destination: p.destination,
      originName: p.origin_airport,
      destinationName: p.destination_airport,
      departDate: p.depart_date,
      returnDate: p.return_date || undefined,
      price: p.price,
      currency: p.currency,
      airline: p.airline,
      flightNumber: p.flight_number,
      link: buildAffiliateLink({
        origin: p.origin,
        destination: p.destination,
        departDate: p.depart_date,
        returnDate: p.return_date || undefined,
      }),
      direct: p.number_of_changes === 0,
    }));
  } catch (error) {
    console.error('Travelpayouts API error:', error);
    return [];
  }
}

export async function searchCheapestFlights(params: {
  origin: string;
  destination: string;
  currency?: string;
}): Promise<FlightOffer[]> {
  try {
    const response = await axios.get<PriceResponse>(
      `${API_BASE}/prices_for_dates`,
      {
        params: {
          token: config.travelpayouts.apiToken,
          origin: params.origin,
          destination: params.destination,
          depart_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          currency: params.currency || 'rub',
          one_way: true,
          sorting: 'price',
          limit: 10,
        },
      },
    );

    if (!response.data.success || !response.data.data?.best_prices) {
      return [];
    }

    return response.data.data.best_prices.slice(0, 5).map((p) => ({
      origin: p.origin,
      destination: p.destination,
      originName: p.origin_airport,
      destinationName: p.destination_airport,
      departDate: p.depart_date,
      returnDate: p.return_date || undefined,
      price: p.price,
      currency: p.currency,
      airline: p.airline,
      flightNumber: p.flight_number,
      link: buildAffiliateLink({
        origin: p.origin,
        destination: p.destination,
        departDate: p.depart_date,
        returnDate: p.return_date || undefined,
      }),
      direct: p.number_of_changes === 0,
    }));
  } catch (error) {
    console.error('Travelpayouts API error:', error);
    return [];
  }
}

import axios from 'axios';
import { config } from '../config';

const HOTELS_API = 'https://engine.hotellook.com/api/v2';

export interface HotelOffer {
  hotelName: string;
  location: string;
  stars: number;
  price: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  link: string;
}

export function buildHotelAffiliateLink(params: {
  hotelId?: number;
  location: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
  marker?: string;
}): string {
  const marker = params.marker || config.travelpayouts.marker;
  const base = 'https://search.hotellook.com';
  const searchParams = new URLSearchParams({
    location: params.location,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    adults: String(params.guests || 1),
    marker,
  });
  return `${base}?${searchParams.toString()}`;
}

export async function searchHotels(params: {
  location: string;
  checkIn: string;
  checkOut: string;
  currency?: string;
  limit?: number;
}): Promise<HotelOffer[]> {
  try {
    const response = await axios.get(`${HOTELS_API}/lookup`, {
      params: {
        token: config.travelpayouts.apiToken,
        location: params.location,
        currency: params.currency || 'rub',
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        limit: params.limit || 5,
      },
    });

    if (!response.data?.results?.hotels) {
      return [];
    }

    return response.data.results.hotels.slice(0, params.limit || 5).map((h: any) => ({
      hotelName: h.hotelName || h.name || 'Unknown',
      location: params.location,
      stars: h.stars || 0,
      price: h.priceFrom || 0,
      currency: params.currency || 'rub',
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guests: 1,
      link: buildHotelAffiliateLink({
        hotelId: h.id,
        location: params.location,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
      }),
    }));
  } catch (error) {
    console.error('Hotels API error:', error);
    return [];
  }
}

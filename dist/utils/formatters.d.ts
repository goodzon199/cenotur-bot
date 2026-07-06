import { FlightOffer } from '../api/travelpayouts';
import { HotelOffer } from '../api/hotels';
export declare function formatFlight(flight: FlightOffer): string;
export declare function formatFlightsList(flights: FlightOffer[], title: string): string;
export declare function formatHotel(hotel: HotelOffer): string;
export declare function formatHotelsList(hotels: HotelOffer[], title: string): string;
export declare function formatSubscriptionInfo(sub: {
    originName: string;
    destinationName: string;
    departDate: string;
    returnDate?: string;
    maxPrice: number;
    currency: string;
    index: number;
}): string;
//# sourceMappingURL=formatters.d.ts.map
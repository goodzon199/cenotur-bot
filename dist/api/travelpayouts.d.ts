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
export declare function buildAffiliateLink(params: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    marker?: string;
}): string;
export declare function searchFlights(params: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    currency?: string;
}): Promise<FlightOffer[]>;
export declare function searchCheapestFlights(params: {
    origin: string;
    destination: string;
    currency?: string;
}): Promise<FlightOffer[]>;
//# sourceMappingURL=travelpayouts.d.ts.map
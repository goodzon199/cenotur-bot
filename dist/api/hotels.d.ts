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
export declare function buildHotelAffiliateLink(params: {
    hotelId?: number;
    location: string;
    checkIn: string;
    checkOut: string;
    guests?: number;
    marker?: string;
}): string;
export declare function searchHotels(params: {
    location: string;
    checkIn: string;
    checkOut: string;
    currency?: string;
    limit?: number;
}): Promise<HotelOffer[]>;
//# sourceMappingURL=hotels.d.ts.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHotelAffiliateLink = buildHotelAffiliateLink;
exports.searchHotels = searchHotels;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const HOTELS_API = 'https://engine.hotellook.com/api/v2';
function buildHotelAffiliateLink(params) {
    const marker = params.marker || config_1.config.travelpayouts.marker;
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
async function searchHotels(params) {
    try {
        const response = await axios_1.default.get(`${HOTELS_API}/lookup`, {
            params: {
                token: config_1.config.travelpayouts.apiToken,
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
        return response.data.results.hotels.slice(0, params.limit || 5).map((h) => ({
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
    }
    catch (error) {
        console.error('Hotels API error:', error);
        return [];
    }
}
//# sourceMappingURL=hotels.js.map
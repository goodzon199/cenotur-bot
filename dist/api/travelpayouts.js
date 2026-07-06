"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAffiliateLink = buildAffiliateLink;
exports.searchFlights = searchFlights;
exports.searchCheapestFlights = searchCheapestFlights;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const API_BASE = 'https://api.travelpayouts.com/aviasales/v3';
function buildAffiliateLink(params) {
    const marker = params.marker || config_1.config.travelpayouts.marker;
    const base = 'https://www.aviasales.ru/search';
    const search = `${params.origin}${params.departDate.replace(/-/g, '')}${params.destination}1`;
    const utm = `?marker=${marker}`;
    return `${base}/${search}${utm}`;
}
async function searchFlights(params) {
    try {
        const response = await axios_1.default.get(`${API_BASE}/prices_for_dates`, {
            params: {
                token: config_1.config.travelpayouts.apiToken,
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
    }
    catch (error) {
        console.error('Travelpayouts API error:', error);
        return [];
    }
}
async function searchCheapestFlights(params) {
    try {
        const response = await axios_1.default.get(`${API_BASE}/prices_for_dates`, {
            params: {
                token: config_1.config.travelpayouts.apiToken,
                origin: params.origin,
                destination: params.destination,
                depart_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
                currency: params.currency || 'rub',
                one_way: true,
                sorting: 'price',
                limit: 10,
            },
        });
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
    }
    catch (error) {
        console.error('Travelpayouts API error:', error);
        return [];
    }
}
//# sourceMappingURL=travelpayouts.js.map
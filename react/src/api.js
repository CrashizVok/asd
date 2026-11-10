import axios from 'axios';

/**
 * One axios instance for the whole app.
 *
 * During development Vite proxies /api to http://localhost:3000.
 * Set VITE_API_URL in .env to point at another server.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
});

export async function getHotels() {
    const { data } = await api.get('/hotels');
    return data;
}

export async function getBookingsByHotel(hotelId) {
    const { data } = await api.get(`/bookings/by-hotel/${hotelId}`);
    return data;
}

export async function searchBookings(word) {
    const { data } = await api.get(`/bookings/by-search/${encodeURIComponent(word)}`);
    return data;
}

export async function updateBooking(body) {
    const { data } = await api.put('/booking', body);
    return data;
}

export async function createCustomer(body) {
    const { data } = await api.post('/customer', body);
    return data;
}

export async function createBooking(body) {
    const { data } = await api.post('/booking', body);
    return data;
}

export async function getGuestTotals(fromDate, toDate) {
    const { data } = await api.get(`/bookings/from/${fromDate}/to/${toDate}`);
    return data;
}

import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isDate(value) {
    return typeof value === 'string' && DATE_PATTERN.test(value);
}

function positiveInt(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 ? number : null;
}

function nonNegativeInt(value) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : null;
}

/**
 * GET /api/bookings/by-hotel/:hotel_id
 * All bookings for one hotel, with the customer data.
 */
router.get('/bookings/by-hotel/:hotel_id', async (request, response, next) => {
    const hotelId = positiveInt(request.params.hotel_id);
    if (hotelId === null) {
        return response.status(400).json({ error: 'Invalid hotel id' });
    }

    try {
        const [rows] = await pool.query(`
            SELECT
                b.customer_email,
                b.hotel_id,
                b.start_date,
                b.end_date,
                b.adults,
                b.children,
                b.boylovers,
                c.first_name,
                c.last_name,
                c.image AS customer_image
            FROM bookings b
            JOIN customers c ON c.email = b.customer_email
            WHERE b.hotel_id = ?
            ORDER BY b.start_date ASC
        `, [hotelId]);

        response.json(rows);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/bookings/by-search/:search_word
 * Search in the guest name, the hotel name, and the hotel description.
 */
router.get('/bookings/by-search/:search_word', async (request, response, next) => {
    const word = String(request.params.search_word || '').trim();
    if (word.length === 0) {
        return response.status(400).json({ error: 'Search word is required' });
    }

    const like = `%${word}%`;

    try {
        const [rows] = await pool.query(`
            SELECT
                b.customer_email,
                c.first_name,
                c.last_name,
                c.image AS customer_image,
                b.hotel_id,
                h.name,
                b.start_date,
                b.end_date,
                b.adults,
                b.children,
                b.boylovers
            FROM bookings b
            JOIN customers c ON c.email = b.customer_email
            JOIN hotels h ON h.id = b.hotel_id
            WHERE c.first_name LIKE ?
               OR c.last_name LIKE ?
               OR CONCAT(c.first_name, ' ', c.last_name) LIKE ?
               OR h.name LIKE ?
               OR h.description LIKE ?
            ORDER BY b.start_date ASC
        `, [like, like, like, like, like]);

        response.json(rows);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/booking
 * Update one booking. The table has no id column, so the booking is
 * identified by customer_email and hotel_id.
 *
 * Only the fields present in the body are updated. If the body has no
 * updateable field, the route returns 400 and touches nothing.
 */
router.put('/booking', async (request, response, next) => {
    const body = request.body || {};
    const email = typeof body.customer_email === 'string'
        ? body.customer_email.trim()
        : '';
    const hotelId = positiveInt(body.hotel_id);

    if (email.length === 0 || hotelId === null) {
        return response.status(400).json({
            error: 'customer_email and hotel_id are required',
        });
    }

    const setClauses = [];
    const values = [];

    const dateFields = ['start_date', 'end_date'];
    for (const field of dateFields) {
        if (body[field] === undefined) {
            continue;
        }
        if (!isDate(body[field])) {
            return response.status(400).json({
                error: `${field} must be YYYY-MM-DD`,
            });
        }
        setClauses.push(`${field} = ?`);
        values.push(body[field]);
    }

    const numberFields = ['adults', 'children', 'boylovers'];
    for (const field of numberFields) {
        if (body[field] === undefined) {
            continue;
        }
        const number = nonNegativeInt(body[field]);
        if (number === null) {
            return response.status(400).json({
                error: `${field} must be a non-negative integer`,
            });
        }
        setClauses.push(`${field} = ?`);
        values.push(number);
    }

    if (setClauses.length === 0) {
        return response.status(400).json({ error: 'No fields to update' });
    }

    try {
        const [existing] = await pool.query(
            'SELECT 1 FROM bookings WHERE customer_email = ? AND hotel_id = ?',
            [email, hotelId]
        );
        if (existing.length === 0) {
            return response.status(404).json({ error: 'Booking not found' });
        }

        await pool.query(
            `UPDATE bookings SET ${setClauses.join(', ')}
             WHERE customer_email = ? AND hotel_id = ?`,
            [...values, email, hotelId]
        );

        const [rows] = await pool.query(`
            SELECT customer_email, hotel_id, start_date, end_date,
                   adults, children, boylovers
            FROM bookings
            WHERE customer_email = ? AND hotel_id = ?
        `, [email, hotelId]);

        response.json(rows[0]);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/booking
 * Insert a new booking.
 */
router.post('/booking', async (request, response, next) => {
    const body = request.body || {};
    const email = typeof body.customer_email === 'string'
        ? body.customer_email.trim()
        : '';
    const hotelId = positiveInt(body.hotel_id);
    const startDate = body.start_date;
    const endDate = body.end_date;
    const adults = body.adults === undefined ? 1 : nonNegativeInt(body.adults);
    const children = body.children === undefined ? 0 : nonNegativeInt(body.children);
    const boylovers = body.boylovers === undefined ? 0 : nonNegativeInt(body.boylovers);

    if (email.length === 0 || hotelId === null) {
        return response.status(400).json({
            error: 'customer_email and hotel_id are required',
        });
    }
    if (!isDate(startDate) || !isDate(endDate)) {
        return response.status(400).json({
            error: 'start_date and end_date must be YYYY-MM-DD',
        });
    }
    if (startDate > endDate) {
        return response.status(400).json({
            error: 'start_date must be before or equal to end_date',
        });
    }
    if (adults === null || children === null || boylovers === null) {
        return response.status(400).json({
            error: 'Guest counts must be non-negative integers',
        });
    }

    try {
        await pool.query(`
            INSERT INTO bookings
                (customer_email, hotel_id, start_date, end_date,
                 adults, children, boylovers)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [email, hotelId, startDate, endDate, adults, children, boylovers]);

        response.status(201).json({
            customer_email: email,
            hotel_id: hotelId,
            start_date: startDate,
            end_date: endDate,
            adults,
            children,
            boylovers,
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({ error: 'Booking already exists' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return response.status(400).json({
                error: 'Customer or hotel does not exist',
            });
        }
        next(error);
    }
});

/**
 * GET /api/bookings/from/:from_date/to/:to_date
 * Sum adults, children, and extra guests for every booking that overlaps
 * the date range. A booking overlaps when it starts on or before the end
 * date and ends on or after the start date.
 */
router.get('/bookings/from/:from_date/to/:to_date', async (request, response, next) => {
    const fromDate = request.params.from_date;
    const toDate = request.params.to_date;

    if (!isDate(fromDate) || !isDate(toDate)) {
        return response.status(400).json({
            error: 'Dates must be YYYY-MM-DD',
        });
    }
    if (fromDate > toDate) {
        return response.status(400).json({
            error: 'from_date must be before or equal to to_date',
        });
    }

    try {
        const [rows] = await pool.query(`
            SELECT
                COALESCE(SUM(adults), 0) AS adults,
                COALESCE(SUM(children), 0) AS children,
                COALESCE(SUM(boylovers), 0) AS boylovers
            FROM bookings
            WHERE start_date <= ? AND end_date >= ?
        `, [toDate, fromDate]);

        const totals = rows[0];
        response.json({
            adults: Number(totals.adults),
            children: Number(totals.children),
            boylovers: Number(totals.boylovers),
        });
    } catch (error) {
        next(error);
    }
});

export default router;

import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

/**
 * GET /api/hotels
 * All hotels with the owner's full name, sorted by hotel name.
 */
router.get('/hotels', async (request, response, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                h.id,
                h.city,
                h.name,
                h.description,
                h.stars,
                h.image AS hotel_image,
                h.owner_email,
                c.first_name,
                c.last_name,
                c.image AS owner_image
            FROM hotels h
            JOIN customers c ON c.email = h.owner_email
            ORDER BY h.name ASC
        `);
        response.json(rows);
    } catch (error) {
        next(error);
    }
});

export default router;

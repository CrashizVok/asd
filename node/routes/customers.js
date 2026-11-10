import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

/**
 * POST /api/customer
 * Insert a new customer. The email is the primary key.
 */
router.post('/customer', async (request, response, next) => {
    const body = request.body || {};
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const firstName = typeof body.first_name === 'string' ? body.first_name.trim() : '';
    const lastName = typeof body.last_name === 'string' ? body.last_name.trim() : '';

    if (email.length === 0 || firstName.length === 0 || lastName.length === 0) {
        return response.status(400).json({
            error: 'email, first_name, and last_name are required',
        });
    }

    const phone = typeof body.phone === 'string' && body.phone.trim() !== ''
        ? body.phone.trim()
        : null;
    const birthday = typeof body.birthday === 'string' && body.birthday.trim() !== ''
        ? body.birthday.trim()
        : null;
    const image = typeof body.image === 'string' && body.image.trim() !== ''
        ? body.image.trim()
        : null;

    try {
        await pool.query(`
            INSERT INTO customers (email, first_name, last_name, phone, birthday, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [email, firstName, lastName, phone, birthday, image]);

        response.status(201).json({
            email,
            first_name: firstName,
            last_name: lastName,
            phone,
            birthday,
            image,
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({ error: 'Customer already exists' });
        }
        next(error);
    }
});

export default router;

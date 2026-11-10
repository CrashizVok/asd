import mysql from 'mysql2/promise';
import 'dotenv/config';

/**
 * One connection pool for the whole app.
 *
 * dateStrings: true keeps DATE columns as "YYYY-MM-DD" strings.
 * Without it, mysql2 converts them to JavaScript Date objects and the
 * timezone can shift the day by one.
 */
export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bookings',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
});

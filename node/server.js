import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import hotelsRouter from './routes/hotels.js';
import bookingsRouter from './routes/bookings.js';
import customersRouter from './routes/customers.js';

const app = express();

// The exam frontend runs on a different port during development.
app.use(cors());
app.use(express.json());

app.get('/api/health', (request, response) => {
    response.json({ ok: true });
});

app.use('/api', hotelsRouter);
app.use('/api', bookingsRouter);
app.use('/api', customersRouter);

// Unknown route.
app.use((request, response) => {
    response.status(404).json({ error: 'Not found' });
});

// Every route calls next(error) on a database problem. This is the one place
// that turns the error into a JSON response.
app.use((error, request, response, next) => {
    console.error(error);
    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({ error: 'Invalid JSON body' });
    }
    response.status(500).json({ error: 'Server error' });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});

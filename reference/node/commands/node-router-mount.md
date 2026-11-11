# app.use(prefix, router)

Node.js command · Router

Mounts a router under a prefix. A request to /api/hotels/4 runs the router route '/:hotel_id'.

## Syntax

```js
app.use('/api/hotels', hotelsRouter)
```

## Example

```js
import express from 'express';
import hotelsRouter from './routes/hotels.js';
import bookingsRouter from './routes/bookings.js';

const app = express();
app.use(express.json());

app.use('/api/hotels', hotelsRouter);
app.use('/api/bookings', bookingsRouter);

app.listen(3000);
```

## Details

The prefix is not repeated inside the router. `router.get('/4')` under a mount of `/api/hotels` answers `/api/hotels/4`.

Several routers on the same prefix is fine and common: `app.use('/api', hotelsRouter)` plus `app.use('/api', bookingsRouter)`, with full paths inside each router.

Order still decides which one answers first, so a router with a catch all route must be mounted last.

# express.Router()

Node.js command · Router

Builds a mini application with the same routing methods that holds no port. Routes inside use paths relative to the mount point.

## Syntax

```js
const router = express.Router([options])
```

## Example

```js
// routes/hotels.js
import { Router } from 'express';

const router = Router();

router.get('/', (request, response) => {
    response.json([{ hotel_id: 1, name: 'Hotel Taurus', city: 'Eger' }]);
});

router.get('/:hotel_id', (request, response) => {
    response.json({ hotel_id: Number(request.params.hotel_id) });
});

export default router;
```

## Details

One file per resource keeps the app file short and makes the routes testable on their own.

`Router({ mergeParams: true })` keeps the parent params when the router is mounted under a parameterised path, for example `/api/hotels/:hotel_id/bookings` where the booking router needs `hotel_id`.

A router can also carry its own middleware with `router.use(...)`, and a 404 inside a router is written the same way as on the app.

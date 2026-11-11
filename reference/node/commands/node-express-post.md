# app.post()

Node.js command · Routing

Registers a handler for POST, the method used to create a row. It reads the payload from req.body, which needs a body parser.

## Syntax

```js
app.post(path, handler)
```

## Example

```js
app.use(express.json());

app.post('/api/booking', (request, response) => {
    const { hotel_id, customer_email, start_date, end_date } = request.body ?? {};

    if (!hotel_id || !customer_email || !start_date || !end_date) {
        return response.status(400).json({ error: 'Missing booking fields' });
    }

    response.status(201).json({ booking_id: 42, hotel_id, customer_email, start_date, end_date });
});
```

## Details

201 with the created row is the answer a client can use: it has the new id without a second request. A plain 200 works but hides that something was created.

A POST with no `Content-Type: application/json` leaves `req.body` as `{}` even when the JSON text is present. Curl needs `-H 'Content-Type: application/json'`.

When the body is malformed the parser calls `next(error)` with `entity.parse.failed`, before your handler runs at all.

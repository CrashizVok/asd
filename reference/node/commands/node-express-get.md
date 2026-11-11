# app.get()

Node.js command · Routing

Registers a handler for GET requests. GET carries no body, so its inputs are the path params and the query string.

## Syntax

```js
app.get(path, [middleware...], handler)
```

## Example

```js
app.get('/api/hotels/:hotel_id', (request, response) => {
    const id = Number(request.params.hotel_id);
    const hotel = hotels.find((row) => row.hotel_id === id);

    if (!hotel) {
        return response.status(404).json({ error: 'Hotel not found' });
    }

    response.json(hotel);
});
```

## Details

A list route and a detail route need different paths. `/api/hotels` returns an array, `/api/hotels/:hotel_id` returns one object, and the client decides from the status code whether it got one.

Extra handlers before the route handler are middleware for that route only:

```js
app.get('/api/hotels', requireApiKey, listHotels);
```

A GET must not change data. A GET that inserts a row is a bug even when it works, because a browser refresh repeats it.

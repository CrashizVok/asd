# req.params

Node.js command · Request

The named segments of the matched path. Values are always strings.

## Syntax

```js
req.params.name
```

## Example

```js
// GET /api/bookings/by-hotel/3  ->  req.params = { hotel_id: '3' }
app.get('/api/bookings/by-hotel/:hotel_id', (request, response) => {
    const hotelId = Number(request.params.hotel_id);

    if (!Number.isInteger(hotelId)) {
        return response.status(400).json({ error: 'hotel_id must be a number' });
    }

    response.json({ hotel_id: hotelId, bookings: [] });
});
```

## Details

Everything from the URL is text. `request.params.hotel_id === 3` is false, and `request.params.hotel_id + 1` gives `'31'`.

A path with two params works the same way: `/api/bookings/from/:from_date/to/:to_date` gives `from_date` and `to_date`, both strings in `YYYY-MM-DD` form when the client sends that format. Validate the format before passing them to MySQL.

Use path params for identity, query params for filters. `/api/hotels?city=Eger` is a filter, `/api/hotels/4` is one row.

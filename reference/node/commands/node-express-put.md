# app.put()

Node.js command · Routing

Registers a handler for PUT, used to replace an existing row. The id usually comes from the body in this exam schema, not from the path.

## Syntax

```js
app.put(path, handler)
```

## Example

```js
app.put('/api/booking', (request, response) => {
    const { booking_id, adults, children } = request.body ?? {};

    if (!booking_id) {
        return response.status(400).json({ error: 'booking_id is required' });
    }

    // UPDATE bookings SET adults = ?, children = ? WHERE booking_id = ?
    const affected = updateBooking(booking_id, adults, children);

    if (affected === 0) {
        return response.status(404).json({ error: 'Booking not found' });
    }

    response.json({ booking_id, adults, children });
});
```

## Details

PUT means replace. A client that sends only two fields is asking to blank the rest, so a partial update either needs PATCH or a merge in the handler.

On the database side `pool.query` returns an `affectedRows` count. Zero means the id does not exist, and that is a 404 rather than a silent 200.

A PUT on a missing row may also create it. Pick one behaviour and keep it in every route.

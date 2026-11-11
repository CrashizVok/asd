# app.delete()

Node.js command · Routing

Registers a handler for DELETE. The id normally comes from the path, and a successful answer has no body.

## Syntax

```js
app.delete(path, handler)
```

## Example

```js
app.delete('/api/booking/:booking_id', async (request, response, next) => {
    const id = Number(request.params.booking_id);

    if (!Number.isInteger(id)) {
        return response.status(400).json({ error: 'booking_id must be a number' });
    }

    try {
        const [result] = await pool.query('DELETE FROM bookings WHERE booking_id = ?', [id]);
        if (result.affectedRows === 0) {
            return response.status(404).json({ error: 'Booking not found' });
        }
        response.status(204).end();   // 204 must not carry a body
    } catch (error) {
        next(error);
    }
});
```

## Details

204 tells the client the delete worked and there is nothing to read. `res.sendStatus(204)` would write the text `No Content` into the body, which the HTTP spec forbids here, so use `res.status(204).end()`.

Deletes that depend on a foreign key fail with a driver error. That is a 409 in a careful API, and a 500 in the exam template, which is acceptable as long as the error handler answers once.

# .update()

Node.js command · Writes

Writes only the keys present in the object and resolves to the number of affected rows. A missing where clause updates every row.

## Syntax

```js
db('bookings').where(key).update(patch)
```

## Example

```js
// PUT /api/booking, partial update
// Only fields the client sent are written.
const patch = {};
for (const field of ['start_date', 'end_date', 'adults', 'children']) {
    if (Object.hasOwn(request.body, field)) patch[field] = request.body[field];
}

if (Object.keys(patch).length === 0) {
    throw new HttpError(400, 'Send at least one field to update');
}

const affected = await db('bookings')
    .where({ customer_email: email, hotel_id: hotelId })
    .update(patch);

if (affected === 0) {
    throw new HttpError(404, 'Booking not found');
}
```

## Details

Never pass `request.body` here. The body can carry `customer_email` or any other column, and the update then moves the row or writes data you did not validate.

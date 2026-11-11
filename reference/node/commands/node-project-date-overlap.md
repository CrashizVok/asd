# Date range overlap

Node.js command · Queries

Finds bookings that touch a date window, including stays that start before it or end after it. Equality counts, because a guest leaving on the last day is still there that morning.

## Syntax

```js
where('start_date', '<=', toDate).where('end_date', '>=', fromDate)
```

## Example

```js
// GET /api/bookings/from/2026-07-01/to/2026-07-31
const fromDate = date(request.params.from_date, 'from_date');
const toDate = date(request.params.to_date, 'to_date');
if (fromDate > toDate) {
    throw new HttpError(400, 'from_date must be before or equal to to_date');
}

const totals = await db('bookings')
    .where('start_date', '<=', toDate)
    .where('end_date', '>=', fromDate)
    .sum({ adults: 'adults', children: 'children' })
    .first();

response.json({ adults: Number(totals?.adults ?? 0) });
```

## Details

The inverted version, `start_date >= from AND end_date <= to`, keeps only bookings inside the window. A stay from June 28 to July 3 then disappears from a July report even though the guests are in the hotel.

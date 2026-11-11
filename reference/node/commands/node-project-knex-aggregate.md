# .count() and .sum()

Node.js command · Queries

Adds aggregate columns. SUM and AVG return DECIMAL, which mysql2 gives back as a string, so convert values with Number before sending JSON.

## Syntax

```js
query.count({ alias: 'column' }).first()
```

## Example

```js
// GET /api/bookings/from/2026-07-01/to/2026-07-31
const totals = await db('bookings')
    .where('start_date', '<=', toDate)
    .where('end_date', '>=', fromDate)
    .sum({ adults: 'adults', children: 'children' })
    .count({ bookings: 'customer_email' })
    .first();

response.json({
    // SUM of a small integer column is DECIMAL, returned as text.
    adults: Number(totals?.adults ?? 0),
    children: Number(totals?.children ?? 0),
    bookings: Number(totals?.bookings ?? 0),
});
```

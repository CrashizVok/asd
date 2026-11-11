# count()

Node.js command · Aggregates

Returns an aggregate row. MySQL sends COUNT as BIGINT, which mysql2 can hand over as a string, so convert before doing arithmetic.

## Syntax

```js
.count('* as total')
```

## Example

```js
// rows: [{ total: 3 }], sometimes [{ total: '3' }]
const [row] = await db('hotels').count('* as total');
const total = Number(row.total);

// Unique guests, not bookings. Without distinct a join multiplies rows.
const [guests] = await db('bookings').countDistinct('customer_email as guests');

// Counting per group.
const perHotel = await db('bookings')
  .select('hotel_id')
  .count('* as booked')
  .groupBy('hotel_id');
```

## Details

`count()` on a builder that already has `limit` counts at most that many rows. Build the count query from a fresh `db(table)`.

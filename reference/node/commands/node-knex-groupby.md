# groupBy()

Node.js command · Aggregates

Collapses rows into groups so aggregates can be computed per group. MySQL 8 rejects plain selected columns that are missing from the group list.

## Syntax

```js
.groupBy('h.id').count('b.customer_email as guests')
```

## Example

```js
const perHotel = await db('bookings')
  .select('hotel_id')
  .count('* as booked')
  .sum('adults as adults')
  .groupBy('hotel_id')
  .havingRaw('count(*) > ?', [1])
  .orderBy('booked', 'desc');

// rows: [{ hotel_id: 1, booked: 2, adults: '3' }]

// Grouping by a joined column needs it in the group list too.
const byCity = await db('hotels as h')
  .join('bookings as b', 'b.hotel_id', 'h.id')
  .select('h.city')
  .countDistinct('b.customer_email as guests')
  .groupBy('h.city');
```

## Details

`SUM` and `AVG` on MySQL come back as DECIMAL, which mysql2 returns as a string. Wrap them in `Number()` before arithmetic or before sending them in JSON.

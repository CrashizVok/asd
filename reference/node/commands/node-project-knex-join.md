# .join() and .leftJoin()

Node.js command · Queries

Joins a second table on a column pair. leftJoin keeps rows from the first table when no match exists, which matters for counts of zero.

## Syntax

```js
.join('customers as c', 'c.email', 'hotels.owner_email')
```

## Example

```js
// Hotels with the owner name, plus a booking count that can be zero.
const rows = await db('hotels as h')
    .join('customers as c', 'c.email', 'h.owner_email')
    .leftJoin('bookings as b', 'b.hotel_id', 'h.id')
    .select(
        'h.id',
        'h.name',
        db.raw("CONCAT(c.first_name, ' ', c.last_name) AS owner_name"),
        // COUNT of a joined column, not COUNT(*): the empty hotel has one
        // row of nulls and COUNT(*) would report 1.
        db.raw('COUNT(b.customer_email) AS bookings')
    )
    .groupBy('h.id', 'h.name', 'c.first_name', 'c.last_name')
    .orderBy('h.name', 'asc');
```

# leftJoin()

Node.js command · Joins

Keeps every row from the left table, with `null` on the right side when nothing matches. Use it for lists that include zero counts.

## Syntax

```js
.leftJoin('bookings as b', 'b.hotel_id', 'h.id')
```

## Example

```js
// Hotels with their booking count, including hotels nobody booked.
const rows = await db('hotels as h')
  .leftJoin('bookings as b', 'b.hotel_id', 'h.id')
  .select('h.id', 'h.name')
  .count('b.customer_email as guests')
  .groupBy('h.id', 'h.name');

// rows: [{ id: 1, name: 'Danube View', guests: 2 }, { id: 3, name: 'City Loft', guests: 0 }]

// A filter on the right side belongs in the join condition.
const withRooms = await db('hotels as h')
  .leftJoin('bookings as b', function () {
    this.on('b.hotel_id', 'h.id').andOn('b.end_date', '>', db.raw('?', ['2025-07-01']));
  })
  .select('h.name', 'b.start_date');
```

## Details

Putting a right-side condition into `where` removes the `null` rows, so the query behaves like an inner join. Use the join callback, or accept `whereNull` as the alternative.

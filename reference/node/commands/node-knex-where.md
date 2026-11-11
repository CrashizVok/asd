# where()

Node.js command · Queries

Adds an AND condition. Values travel as bindings, so quotes in the value cannot change the statement.

## Syntax

```js
.where(column, value) | .where(column, operator, value) | .where(object)
```

## Example

```js
await db('hotels').where('city', 'Budapest');             // city = 'Budapest'
await db('hotels').where('stars', '>=', 4);               // stars >= 4
await db('hotels').where({ city: 'Budapest', stars: 4 }); // both, joined with AND

// Lists and NULL need their own methods.
await db('bookings').whereIn('hotel_id', [1, 2, 3]);
await db('customers').whereNull('phone');
await db('bookings').whereBetween('start_date', ['2025-07-01', '2025-07-31']);

// Grouping: without the callback the OR escapes every other condition.
await db('hotels')
  .where('stars', '>=', 4)
  .where(function () {
    this.where('city', 'Budapest').orWhere('city', 'Debrecen');
  });
// where stars >= 4 and (city = 'Budapest' or city = 'Debrecen')
```

## Details

`where('phone', null)` builds `phone = NULL`, which is never true and returns no rows. Use `whereNull`. An empty array in `whereIn` produces a false condition, so the query returns nothing instead of failing.

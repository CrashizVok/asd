# raw()

Node.js command · Raw SQL

Sends SQL you write yourself, still with bound values. On MySQL it resolves to `[rows, fields]`, not to rows.

## Syntax

```js
db.raw(sql, bindings)
```

## Example

```js
// Destructure the rows; the second item is the field metadata.
const [rows] = await db.raw(
  'select hotel_id, count(*) as booked from bookings group by hotel_id'
);
console.log(rows[0].booked);

// Bound values, never interpolation.
const [matched] = await db.raw(
  'select id, name from hotels where city = ? and stars >= ?',
  ['Budapest', 4]
);

// Raw expression inside a builder, for functions knex does not model.
const owners = await db('hotels as h')
  .join('customers as c', 'c.email', 'h.owner_email')
  .select('h.name', db.raw("concat(c.first_name, ' ', c.last_name) as owner"));
```

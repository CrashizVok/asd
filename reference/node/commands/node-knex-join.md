# join()

Node.js command · Joins

Adds an inner join. Only rows with a match on both sides survive.

## Syntax

```js
.join('customers as c', 'c.email', 'b.customer_email')
```

## Example

```js
// Bookings with the guest name and image the frontend renders.
const rows = await db('bookings as b')
  .join('customers as c', 'c.email', 'b.customer_email')
  .select(
    'b.customer_email',
    'b.hotel_id',
    'b.start_date',
    'b.end_date',
    'b.adults',
    'b.children',
    'c.first_name',
    'c.last_name',
    'c.image as customer_image'
  )
  .where('b.hotel_id', 1)
  .orderBy('b.start_date', 'asc');

// Three tables, all columns qualified.
const detailed = await db('bookings as b')
  .join('customers as c', 'c.email', 'b.customer_email')
  .join('hotels as h', 'h.id', 'b.hotel_id')
  .select('c.last_name', 'h.name', 'h.city', 'b.start_date');
```

## Details

Always alias and qualify. Two joined tables with a `name` column give an ambiguous column error, and unqualified `select('*')` silently drops one of them from the result object.

# .where()

Node.js command · Queries

Adds an AND condition. Several calls chain, and a callback argument groups OR conditions so a later filter cannot attach to the last OR.

## Syntax

```js
.where(column, value) / .where({ column: value })
```

## Example

```js
// GET /api/hotels?city=Eger&min_stars=3
const query = db('hotels').select('id', 'name', 'city', 'stars');

if (city) query.where('city', city);
if (minStars > 0) query.where('stars', '>=', minStars);

// Object form, all conditions joined with AND.
const booking = await db('bookings')
    .where({ customer_email: email, hotel_id: hotelId })
    .first();

// Callback form keeps the ORs together: (city OR name) AND stars >= 3.
const results = await db('hotels')
    .where((group) => {
        group.where('city', 'like', '%Eger%').orWhere('name', 'like', '%Eger%');
    })
    .where('stars', '>=', 3);
```

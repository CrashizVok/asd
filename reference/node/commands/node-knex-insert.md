# insert()

Node.js command · Writes

Writes one row or many. On MySQL it resolves to `[insertId]`, an array whose first item is the auto increment value.

## Syntax

```js
.insert(row) | .insert([row, row])
```

## Example

```js
// One row: destructure the generated id.
const [hotelId] = await db('hotels').insert({
  city: 'Eger',
  name: 'Hill House',
  description: 'Six rooms above a bakery.',
  stars: 3,
  owner_email: 'anna.kovacs@example.com',
  image: null,
});
console.log(hotelId); // 4

// Many rows in one statement. MySQL reports the first generated id only.
await db('bookings').insert([
  { customer_email: 'anna.kovacs@example.com', hotel_id: 1, start_date: '2025-07-01', end_date: '2025-07-05', adults: 2, children: 1, boylovers: 0 },
  { customer_email: 'ben.nagy@example.com', hotel_id: 1, start_date: '2025-07-10', end_date: '2025-07-12', adults: 1, children: 0, boylovers: 0 },
]);
```

## Details

The bookings table has a composite primary key and no auto increment, so an insert id comes back as 0. Do not treat it as the key of the new row.

# filter()

JavaScript command · Transform

Returns a new array with the elements for which the callback returns true.

## Syntax

```js
array.filter(callback)
```

## Example

```js
// Data shape: list of booking objects with a total
const bookings = [
  { booking_id: 1, total: 480, city: 'Vienna' },
  { booking_id: 2, total: 150, city: 'Graz' },
  { booking_id: 3, total: 910, city: 'Vienna' },
];

const big = bookings.filter((item) => item.total >= 480);
console.log(big.length); // 2
console.log(big.map((item) => item.booking_id)); // [1, 3]

const vienna = bookings.filter((item) => item.city === 'Vienna');
console.log(vienna.length); // 2

console.log(bookings.length); // 3, the input is untouched
```

## Details

The result is always a new array, possibly empty, never `undefined`. The callback should be a pure test; pushing into an outside array from inside `filter` defeats the point and makes the result confusing. Combine with `map` for the common keep then reshape chain.

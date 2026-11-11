# find()

JavaScript command · Search

Returns the first element for which the callback returns true, or undefined.

## Syntax

```js
array.find(callback)
```

## Example

```js
// Data shape: list of booking objects
const bookings = [
  { booking_id: 1, city: 'Vienna', adults: 2 },
  { booking_id: 2, city: 'Graz', adults: 1 },
];

const found = bookings.find((item) => item.city === 'Graz');
console.log(found); // { booking_id: 2, city: 'Graz', adults: 1 }

console.log(bookings.find((item) => item.city === 'Linz')); // undefined

// Guard before reading a property
const linz = bookings.find((item) => item.city === 'Linz');
console.log(linz?.booking_id); // undefined, no throw
```

## Details

The callback gets the element, the index, and the array. `find` stops at the first true, so put the most likely match first only if that ordering is meaningful; otherwise it is just an early exit. `findIndex` returns the position instead of the element.

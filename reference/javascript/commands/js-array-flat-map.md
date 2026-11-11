# flatMap()

JavaScript command · Transform

Maps each element and flattens the results one level into a single array.

## Syntax

```js
array.flatMap(callback)
```

## Example

```js
// Data shape: hotels, each with a bookings array
const hotels = [
  { name: 'Ring', bookings: [{ total: 100 }, { total: 200 }] },
  { name: 'Park', bookings: [{ total: 50 }] },
];

const totals = hotels.flatMap((hotel) =>
  hotel.bookings.map((booking) => booking.total)
);
console.log(totals); // [100, 200, 50]

// One level only, deeper nesting stays
console.log([[1], [[2]]].flatMap((value) => value)); // [1, [2]]
```

## Details

`flatMap` is `map` followed by `flat(1)` in one pass. It is the shortest way to turn a list of parents into a flat list of children. Return a non-array and it is appended as a single element.

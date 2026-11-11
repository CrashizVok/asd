# array.reduce()

JavaScript command · Arrays

Folds the array into one value. The accumulator type can be anything, which is why reduce can build objects too.

## Syntax

```js
array.reduce((acc, item) => next, initial)
```

## Example

```js
const bookings = [
  { hotel_id: 1, adults: 2, children: 1 },
  { hotel_id: 2, adults: 2, children: 0 },
  { hotel_id: 1, adults: 1, children: 2 }
];

// Sum a field
const people = bookings.reduce(
  (sum, booking) => sum + booking.adults + booking.children,
  0
);
console.log(people); // 8

// Group into an object keyed by hotel_id
const byHotel = bookings.reduce((acc, booking) => {
  acc[booking.hotel_id] = (acc[booking.hotel_id] || 0) + 1;
  return acc;
}, {});
console.log(byHotel); // { "1": 2, "2": 1 }
```

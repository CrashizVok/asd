# array.flatMap()

JavaScript command · Arrays

Maps every item and flattens the result one level. Use it when one input item should produce zero, one, or many outputs.

## Syntax

```js
array.flatMap(item => result)
```

## Example

```js
const bookings = [
  { hotel: "Danube View", guests: ["Anna", "Bela"] },
  { hotel: "City Loft", guests: ["Csilla"] }
];

// map would give an array of arrays, flatMap gives one flat list
const guests = bookings.flatMap((booking) => booking.guests);
console.log(guests); // ["Anna","Bela","Csilla"]

// Returning an empty array drops the item entirely
const onlyLong = bookings.flatMap((booking) =>
  booking.guests.length > 1 ? [booking.hotel] : []
);
console.log(onlyLong); // ["Danube View"]
```

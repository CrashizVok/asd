# every()

JavaScript command · Test

Returns true only when every element passes the test, and stops at the first failure.

## Syntax

```js
array.every(callback)
```

## Example

```js
// Data shape: list of hotel objects
const hotels = [
  { name: 'Ring', stars: 5 },
  { name: 'Park', stars: 3 },
];

console.log(hotels.every((hotel) => hotel.stars >= 3)); // true
console.log(hotels.every((hotel) => hotel.stars === 5)); // false

// Empty array: vacuously true
console.log([].every((hotel) => hotel.stars > 5)); // true

// Guard a form before sending it
const valid = hotels.every((hotel) => hotel.name && hotel.stars > 0);
console.log(valid); // true
```

## Details

`every` on an empty array returns `true`, which follows from the definition: there is no element that fails. That surprises people validating input, so check `length > 0` as well when an empty list is not acceptable. The counterpart `some` returns `false` on an empty array.

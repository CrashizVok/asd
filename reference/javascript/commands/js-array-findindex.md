# findIndex()

JavaScript command · Search

Returns the index of the first element that passes the test, or -1.

## Syntax

```js
array.findIndex(callback)
```

## Example

```js
// Data shape: list of hotel objects
const hotels = [
  { name: 'Ring', stars: 5 },
  { name: 'Park', stars: 3 },
];

const position = hotels.findIndex((hotel) => hotel.name === 'Park');
console.log(position); // 1

console.log(hotels.findIndex((hotel) => hotel.name === 'Garden')); // -1

// Remove the found record with splice
if (position !== -1) {
  hotels.splice(position, 1);
}
console.log(hotels.length); // 1
```

## Details

`findIndex` is the object-aware version of `indexOf`: it takes a test instead of a value. The `-1` result must be checked before using it in `splice`, because `splice(-1, 1)` removes the last element rather than doing nothing.

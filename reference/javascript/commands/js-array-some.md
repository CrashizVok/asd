# some()

JavaScript command · Test

Returns true when at least one element passes the test, and stops at the first pass.

## Syntax

```js
array.some(callback)
```

## Example

```js
// Data shape: list of booking objects
const bookings = [
  { adults: 2, children: 0 },
  { adults: 1, children: 2 },
];

console.log(bookings.some((item) => item.children > 0)); // true
console.log(bookings.some((item) => item.adults > 5));   // false

// Empty array: no element can pass
console.log([].some((value) => value > 0)); // false

// Early exit is visible in the log
[1, 2, 3].some((value) => {
  console.log('check', value);
  return value === 2;
}); // logs 1 and 2 only
```

## Details

`some` answers whether a match exists without building an array. It short circuits, so callbacks with side effects run only until the first true. On an empty array it returns `false`.

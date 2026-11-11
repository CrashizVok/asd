# includes()

JavaScript command · Search

Returns true when the array contains the value, comparing with SameValueZero.

## Syntax

```js
array.includes(value)
```

## Example

```js
// Data shape: list of room numbers
const rooms = [101, 205, 309];

console.log(rooms.includes(205)); // true
console.log(rooms.includes(999)); // false

// NaN is found, unlike with indexOf
console.log([NaN].includes(NaN)); // true
console.log([NaN].indexOf(NaN));  // -1

// Objects are compared by reference, not by content
const a = { hotel_id: 1 };
console.log([a].includes({ hotel_id: 1 })); // false
console.log([a].includes(a));               // true
```

## Details

Use `includes` for primitives and for a yes or no answer. For an array of objects, the value must be the same reference, so a freshly built object never matches. Use `some` with a predicate in that case.

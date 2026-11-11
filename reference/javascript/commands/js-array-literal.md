# Array literal

JavaScript command · Creation

Creates a new array from the values between the brackets, in order.

## Syntax

```js
const list = [value1, value2]
```

## Example

```js
// Data shape: ordered list of numbers, indexes 0..2
const scores = [12, 7, 30];

console.log(scores[0]);     // 12
console.log(scores.length); // 3
console.log(Array.isArray(scores)); // true

// A literal can hold mixed values, but a single type is easier to work with
const mixed = ['Vienna', 4, true];
```

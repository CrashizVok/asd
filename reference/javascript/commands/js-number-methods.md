# toFixed, isNaN, Number.isFinite

JavaScript command · Numbers and Math

toFixed formats with decimals and returns a string. Number.isNaN checks specifically for NaN.

## Syntax

```js
value.toFixed(2)
Number.isNaN(value)
```

## Example

```js
const price = 12.345;
console.log(price.toFixed(2)); // "12.35"

console.log(Number.isNaN(NaN));    // true
console.log(Number.isFinite(42));  // true
console.log(Number.isFinite(Infinity)); // false
```

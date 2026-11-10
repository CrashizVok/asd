# map

JavaScript command · Arrays

Creates a new array by transforming every item. The original array is not changed.

## Syntax

```js
array.map(item => newValue)
```

## Example

```js
const prices = [80, 120, 95];
const withTax = prices.map((price) => Math.round(price * 1.18));

console.log(withTax); // [94, 142, 112]
```

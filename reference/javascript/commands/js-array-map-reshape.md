# map()

JavaScript command · Transform

Returns a new array with one output per input, in the same order.

## Syntax

```js
array.map(callback)
```

## Example

```js
// Data shape: list of prices in euros
const prices = [40, 15, 90];

const withTax = prices.map((price) => price * 1.2);
console.log(withTax); // [48, 18, 108]
console.log(prices);  // [40, 15, 90], unchanged

// Reshape objects, keeping only what is needed
const hotels = [
  { hotel_id: 1, name: 'Ring', stars: 5 },
  { hotel_id: 2, name: 'Park', stars: 3 },
];
const labels = hotels.map((hotel) => `${hotel.name} (${hotel.stars})`);
console.log(labels); // ['Ring (5)', 'Park (3)']

// Index is available as the second argument
console.log(prices.map((price, index) => index + ':' + price));
```

## Details

`map` keeps the length. Elements where the callback returns `undefined` stay in the result as `undefined`, so filter first if the output must be dense. Use `map` for the value it returns; use `forEach` when the point is a side effect.

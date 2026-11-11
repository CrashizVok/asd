# reduce()

JavaScript command · Transform

Folds the array into one value by carrying an accumulator from element to element.

## Syntax

```js
array.reduce(callback, initialValue)
```

## Example

```js
// Data shape: array of booking totals in euros
const totals = [240, 120, 380];

const sum = totals.reduce((acc, value) => acc + value, 0);
console.log(sum); // 740

// The accumulator can be any type, here an object
const cities = ['Vienna', 'Graz', 'Vienna'];
const counts = cities.reduce((acc, city) => {
  acc[city] = (acc[city] || 0) + 1;
  return acc;
}, {});
console.log(counts); // { Vienna: 2, Graz: 1 }

// Max without sorting
const max = totals.reduce((acc, value) => Math.max(acc, value), 0);
console.log(max); // 380
```

## Details

The callback receives the accumulator, the current element, the index, and the array, and must return the next accumulator. Without the starting value, `reduce` uses the first element as the seed and begins at index 1, and throws `TypeError` on an empty array. Pass a starting value for sums, counts, grouping and any case where the array can be empty.

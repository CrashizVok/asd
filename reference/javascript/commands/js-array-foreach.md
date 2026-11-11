# forEach()

JavaScript command · Iteration

Runs a function once per element for its side effects and returns undefined.

## Syntax

```js
array.forEach(callback)
```

## Example

```js
// Data shape: list of guest names
const guests = ['Ana', 'Bela', 'Csilla'];

const result = guests.forEach((name, index) => {
  console.log(index, name);
});
console.log(result); // undefined

// Accumulate into an outside variable when that is the goal
let total = 0;
[10, 20, 30].forEach((value) => {
  total += value;
});
console.log(total); // 60
```

## Details

`forEach` cannot `break`, and returning from the callback only skips the current element. Use `for...of` when you need `break`, and `map`, `filter` or `reduce` when you need a value. Changing the array inside the callback shifts the remaining indexes and skips elements.

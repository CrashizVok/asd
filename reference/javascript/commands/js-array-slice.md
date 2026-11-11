# slice()

JavaScript command · Copy and combine

Returns a shallow copy from start up to but not including end. The original is unchanged.

## Syntax

```js
array.slice(start, end)
```

## Example

```js
// Data shape: list of scores in order
const scores = [10, 20, 30, 40, 50];

console.log(scores.slice(1, 3)); // [20, 30]
console.log(scores.slice(2));    // [30, 40, 50]
console.log(scores.slice(-2));   // [40, 50]
console.log(scores.slice());     // full shallow copy
console.log(scores.slice(3, 1)); // []

scores.slice(0, 2)[0] = 99;
console.log(scores[0]); // 10, the copy was separate
```

## Details

`slice()` with no arguments is the shortest way to copy an array. The copy is shallow, so objects inside are shared with the original. `slice` never mutates its input, which is the opposite of `splice` in both name and behaviour.

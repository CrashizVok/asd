# Array.from()

JavaScript command · Creation

Builds a real array from any iterable or array-like value, with an optional mapping function.

## Syntax

```js
Array.from(source, mapFn?)
```

## Example

```js
// Data shape: string, Set, or array-like input
const letters = Array.from('abc');            // ['a', 'b', 'c']
const unique = Array.from(new Set([1, 1, 2])); // [1, 2]

// Second argument maps while building, index included
const even = Array.from({ length: 4 }, (_, index) => index * 2);
console.log(even); // [0, 2, 4, 6]
```

## Details

The source can be a string, a `Set`, a `Map`, another array, a `NodeList`, or any object with a `length` property. The second argument receives the value and the index, so a fill loop becomes one call. `Array.from` copies, so the new array and the source do not share elements changed later at the top level.

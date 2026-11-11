# indexOf()

JavaScript command · Search

Returns the index of the first strict match, or -1 when nothing matches.

## Syntax

```js
array.indexOf(value, fromIndex?)
```

## Example

```js
// Data shape: list of hotel ids
const ids = [10, 11, 12, 11];

console.log(ids.indexOf(11));      // 1, first match only
console.log(ids.indexOf(11, 2));   // 3, start searching at index 2
console.log(ids.indexOf(99));      // -1

// The -1 result is a common bug when used as an index
const position = ids.indexOf(99);
console.log(ids[position]); // undefined

if (position !== -1) {
  console.log('found at', position);
}
```

## Details

`indexOf` uses strict equality, so it never finds `NaN` and never matches two objects with equal contents. Always test against `-1` before using the result as an index. `lastIndexOf` searches from the end.

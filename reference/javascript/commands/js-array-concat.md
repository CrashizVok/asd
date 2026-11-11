# concat()

JavaScript command · Copy and combine

Returns a new array with the elements of the original followed by the elements of each argument.

## Syntax

```js
array.concat(other)
```

## Example

```js
// Data shape: two lists of tags
const a = ['red', 'green'];
const b = ['blue'];

console.log(a.concat(b));     // ['red', 'green', 'blue']
console.log(a);               // ['red', 'green'], unchanged
console.log(a.concat(b, ['x'])); // three groups appended

// Nested arrays are not flattened
console.log([1].concat([2, [3]])); // [1, 2, [3]]

// The spread form most code uses now
console.log([...a, ...b]); // ['red', 'green', 'blue']
```

## Details

`concat` flattens one level of array arguments. Non-array arguments are appended as single elements. It always returns a new array, so chaining it is safe.

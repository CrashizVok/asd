# Array.isArray()

JavaScript command · Arrays

Returns true only for real arrays. typeof reports every object as object, so this is the reliable check.

## Syntax

```js
Array.isArray(value)
```

## Example

```js
console.log(Array.isArray([1, 2]));        // true
console.log(Array.isArray({ length: 2 }));  // false, array-like but not an array
console.log(Array.isArray("abc"));          // false

// A common guard before array methods
function total(value) {
  if (!Array.isArray(value)) return 0;
  return value.reduce((sum, item) => sum + item, 0);
}

console.log(total([2, 3, 4])); // 9
console.log(total("2,3,4"));   // 0
```

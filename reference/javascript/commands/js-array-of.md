# Array.of()

JavaScript command · Creation

Creates an array with exactly the arguments as elements, including a single number.

## Syntax

```js
Array.of(...values)
```

## Example

```js
// Data shape: one value becomes one element
console.log(Array.of(7));       // [7]
console.log(Array.of(7, 8, 9)); // [7, 8, 9]

// The trap this avoids:
console.log(new Array(7).length); // 7, but the array is empty of values
console.log(Array.of(7).length);  // 1
```

## Details

`new Array(7)` treats a single numeric argument as a length and creates seven holes. `Array.of` treats every argument as an element, so `Array.of(7)` has length one. Use `Array.of` when the value comes from a variable and might be a number.

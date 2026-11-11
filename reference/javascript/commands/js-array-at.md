# at()

JavaScript command · Index and length

Reads one element by index and accepts negative numbers to count from the end.

## Syntax

```js
array.at(index)
```

## Example

```js
// Data shape: ordered list of stops
const stops = ['A', 'B', 'C'];

console.log(stops.at(0));   // 'A'
console.log(stops.at(-1));  // 'C', the last element
console.log(stops.at(-2));  // 'B'
console.log(stops.at(9));   // undefined, no error

// The old form still works and still needs the arithmetic:
console.log(stops[stops.length - 1]); // 'C'
```

## Details

Bracket access with a negative number does not read from the end; it looks up a property named `-1` and returns `undefined`. `at` is the method form that handles the offset. On a string it returns a character the same way.

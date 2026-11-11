# push()

JavaScript command · Add and remove

Adds values at the end and returns the new length.

## Syntax

```js
array.push(...values)
```

## Example

```js
// Data shape: list of guest names
const guests = ['Ana', 'Bela'];

const size = guests.push('Csilla');
console.log(size);   // 3, the return value is a number
console.log(guests); // ['Ana', 'Bela', 'Csilla']

// Several values at once, in argument order
guests.push('Dora', 'Emil');
console.log(guests.length); // 5
```

## Details

`push` mutates the array and returns the new length, not the array. Chaining `push` therefore gives you a number, not something you can push again. For a new array instead of a mutation, use `[...guests, 'Csilla']`.

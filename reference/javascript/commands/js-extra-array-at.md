# array.at()

JavaScript command · Arrays

Reads an item by index and accepts negative values, so the last item is at(-1).

## Syntax

```js
array.at(index)
```

## Example

```js
const cities = ["Eger", "Budapest", "Gyor"];

console.log(cities.at(0));   // Eger
console.log(cities.at(-1));  // Gyor
console.log(cities.at(-2));  // Budapest

// Before at(), the last item was cities[cities.length - 1]
console.log(cities[cities.length - 1] === cities.at(-1)); // true

// Out of range returns undefined, it does not throw
console.log(cities.at(9)); // undefined
```

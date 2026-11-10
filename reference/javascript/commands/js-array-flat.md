# flat and flatMap

JavaScript command · Arrays

flat removes nested array levels. flatMap maps and flattens one level.

## Syntax

```js
array.flat()
array.flatMap(item => [values])
```

## Example

```js
const nested = [[1, 2], [3], [4, 5]];
console.log(nested.flat()); // [1, 2, 3, 4, 5]

const words = ["a b", "c d"];
console.log(words.flatMap((text) => text.split(" "))); // ["a", "b", "c", "d"]
```

# array.flat()

JavaScript command · Arrays

Flattens nested arrays up to the given depth. The default depth of one level is often not what people expect from deep data.

## Syntax

```js
array.flat(depth = 1)
```

## Example

```js
const oneLevel = [1, [2, 3], [4, [5]]];
console.log(oneLevel.flat());     // [1,2,3,4,[5]]
console.log(oneLevel.flat(2));    // [1,2,3,4,5]
console.log(oneLevel.flat(Infinity)); // [1,2,3,4,5]

// Rows loaded from an API often nest one level too deep
const pages = [[{ id: 1 }, { id: 2 }], [{ id: 3 }]];
const hotels = pages.flat();
console.log(hotels.length); // 3
```

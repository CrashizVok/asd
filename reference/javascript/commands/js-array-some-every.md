# some and every

JavaScript command · Arrays

some is true when at least one item passes. every is true when all items pass.

## Syntax

```js
array.some(test)
array.every(test)
```

## Example

```js
const stars = [4, 5, 3];

console.log(stars.some((n) => n === 5));  // true
console.log(stars.every((n) => n >= 3)); // true
```

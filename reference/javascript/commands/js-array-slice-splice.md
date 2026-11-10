# slice and splice

JavaScript command · Arrays

slice copies a part without changing the original. splice changes the original by removing or adding items.

## Syntax

```js
array.slice(start, end)
array.splice(start, deleteCount, ...items)
```

## Example

```js
const list = ["a", "b", "c", "d"];

console.log(list.slice(1, 3)); // ["b", "c"]

const copy = [...list];
copy.splice(1, 1, "B");
console.log(copy); // ["a", "B", "c", "d"]
```

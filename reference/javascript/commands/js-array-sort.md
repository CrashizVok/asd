# sort

JavaScript command · Arrays

Sorts in place. Without a compare function, values are converted to strings. Copy first if you need the original order.

## Syntax

```js
array.sort((a, b) => a - b)
```

## Example

```js
const names = ["Cara", "Anna", "Ben"];
const sorted = [...names].sort((a, b) => a.localeCompare(b));

const numbers = [10, 2, 30];
numbers.sort((a, b) => a - b); // [2, 10, 30]
```

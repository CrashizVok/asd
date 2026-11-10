# rest and spread

JavaScript command · Functions

... collects remaining arguments into an array, or spreads an iterable into values.

## Syntax

```js
function sum(...numbers) {}
const copy = [...items];
```

## Example

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

const first = [1, 2];
const all = [...first, 3, 4];
console.log(sum(...all)); // 10
```

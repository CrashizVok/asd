# random integer

JavaScript command · Numbers and Math

Returns a random integer from 0 to max - 1. Add min and a range for a custom range.

## Syntax

```js
Math.floor(Math.random() * max)
```

## Example

```js
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(randomInt(1, 6)); // 1 to 6
```

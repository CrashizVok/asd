# function declaration

JavaScript command · Functions

A reusable block. It is hoisted, so it can be called before its definition in the same scope.

## Syntax

```js
function name(param) { return value; }
```

## Example

```js
function nightsBetween(start, end) {
  const day = 1000 * 60 * 60 * 24;
  return Math.round((new Date(end) - new Date(start)) / day);
}

console.log(nightsBetween("2026-07-01", "2026-07-04")); // 3
```

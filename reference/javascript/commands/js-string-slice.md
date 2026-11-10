# slice, substring, substr

JavaScript command · Strings

Returns part of a string. slice accepts negative indexes. substring swaps start and end if needed. Prefer slice.

## Syntax

```js
text.slice(start, end)
```

## Example

```js
const date = "2026-07-01";

console.log(date.slice(0, 4));  // 2026
console.log(date.slice(5, 7));  // 07
console.log(date.slice(-2));    // 01
```

# getFullYear, getMonth, getDate

JavaScript command · Dates and JSON

Reads date parts. getMonth is 0-based: January is 0, December is 11.

## Syntax

```js
date.getFullYear()
date.getMonth()
```

## Example

```js
const date = new Date("2026-07-01");

console.log(date.getFullYear()); // 2026
console.log(date.getMonth() + 1); // 7
console.log(date.getDate());      // 1
```

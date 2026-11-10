# Date

JavaScript command · Dates and JSON

Creates a date object. Use ISO strings (yyyy-mm-dd) for predictable parsing.

## Syntax

```js
new Date()
new Date("2026-07-01")
```

## Example

```js
const start = new Date("2026-07-01");
const end = new Date("2026-07-04");
const day = 1000 * 60 * 60 * 24;

console.log((end - start) / day); // 3
```

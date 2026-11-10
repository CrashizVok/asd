# toISOString and toLocaleDateString

JavaScript command · Dates and JSON

toISOString gives a UTC string. slice(0, 10) keeps yyyy-mm-dd. toLocaleDateString formats for a locale.

## Syntax

```js
date.toISOString().slice(0, 10)
```

## Example

```js
const date = new Date("2026-07-01T12:00:00");

console.log(date.toISOString().slice(0, 10)); // 2026-07-01
console.log(date.toLocaleDateString("hu-HU")); // 2026. 07. 01.
```

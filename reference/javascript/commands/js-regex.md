# regular expressions

JavaScript command · Collections

Matches text patterns. Common flags: g global, i case-insensitive, m multiline.

## Syntax

```js
/pattern/flags
new RegExp("pattern", "g")
```

## Example

```js
const email = "anna@example.com";
const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

console.log(pattern.test(email)); // true
console.log("2026-07-01".replace(/-/g, "/")); // 2026/07/01
```

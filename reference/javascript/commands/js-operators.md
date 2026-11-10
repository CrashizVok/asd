# arithmetic and comparison operators

JavaScript command · Operators

Arithmetic works as expected. Use === and !== to compare without type conversion. == and != convert types and cause bugs.

## Syntax

```js
+ - * / % ** === !== > < >= <=
```

## Example

```js
const total = 2 * 3 + 1; // 7
const rest = 10 % 3;      // 1
const power = 2 ** 8;     // 256

console.log(5 === "5"); // false
console.log(5 == "5");  // true, avoid
```

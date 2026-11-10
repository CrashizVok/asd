# Number and parseInt

JavaScript command · Numbers and Math

Number converts a value to a number and returns NaN when it cannot. parseInt reads an integer and stops at the first non-digit.

## Syntax

```js
Number(value)
parseInt(value, 10)
```

## Example

```js
console.log(Number("42"));      // 42
console.log(Number("42px"));    // NaN
console.log(parseInt("42px", 10)); // 42
console.log(Number(""));        // 0
```

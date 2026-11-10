# ternary operator

JavaScript command · Control flow

A short if/else expression. Use it for simple choices, not nested logic.

## Syntax

```js
condition ? valueIfTrue : valueIfFalse
```

## Example

```js
const nights = 1;
const label = nights === 1 ? "night" : "nights";
console.log(`${nights} ${label}`);
```

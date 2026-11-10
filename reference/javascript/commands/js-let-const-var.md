# let, const, var

JavaScript command · Basics

Declares a variable. Use const by default, let when the value changes, and avoid var because it has function scope and hoisting surprises.

## Syntax

```js
const name = "Anna";
let count = 0;
```

## Example

```js
const hotel = "Danube View";
let nights = 3;
nights = nights + 1;
console.log(hotel, nights);
```

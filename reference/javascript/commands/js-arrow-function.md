# arrow function

JavaScript command · Functions

A shorter function. It does not have its own this, arguments, or super. Use it for callbacks and short helpers.

## Syntax

```js
const fn = (a, b) => a + b;
```

## Example

```js
const double = (n) => n * 2;
const greet = (name) => {
  console.log(`Hello ${name}`);
};

console.log(double(4)); // 8
```

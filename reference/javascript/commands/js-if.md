# if, else if, else

JavaScript command · Control flow

Runs a block when a condition is truthy. Use else if for more branches.

## Syntax

```js
if (condition) { ... } else { ... }
```

## Example

```js
const stars = 4;

if (stars >= 5) {
  console.log("Luxury");
} else if (stars >= 3) {
  console.log("Comfortable");
} else {
  console.log("Basic");
}
```

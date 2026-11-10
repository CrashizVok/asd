# switch

JavaScript command · Control flow

Compares one value with several cases. break stops fall-through.

## Syntax

```js
switch (value) { case 1: ... break; default: ... }
```

## Example

```js
const day = "sat";

switch (day) {
  case "sat":
  case "sun":
    console.log("Weekend");
    break;
  default:
    console.log("Weekday");
}
```

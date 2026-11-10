# padStart and padEnd

JavaScript command · Strings

Pads a string to a length with a fill character. Useful for numbers and IDs.

## Syntax

```js
text.padStart(5, "0")
```

## Example

```js
const id = "42";
console.log(id.padStart(4, "0")); // 0042
console.log("7".padEnd(3, "."));  // 7..
```

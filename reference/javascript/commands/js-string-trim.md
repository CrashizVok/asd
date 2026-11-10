# trim, trimStart, trimEnd

JavaScript command · Strings

Removes whitespace from both ends, or one end. Useful for form input.

## Syntax

```js
text.trim()
```

## Example

```js
const input = "  Anna  ";
console.log(input.trim());      // "Anna"
console.log(input.trimStart()); // "Anna  "
console.log(input.trimEnd());   // "  Anna"
```

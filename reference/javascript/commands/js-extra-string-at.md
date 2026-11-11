# String.at()

JavaScript command · Strings

Returns the character at an index and accepts negatives. It avoids the bracket plus length arithmetic.

## Syntax

```js
text.at(index)
```

## Example

```js
const code = "HU-2026";

console.log(code.at(0));   // "H"
console.log(code.at(-1));  // "6"
console.log(code.at(-4));  // "2"

// The bracket form returns undefined past the end, at() does too
console.log(code.at(99));  // undefined
console.log(code[99]);     // undefined

// charAt returns an empty string instead, which hides bugs
console.log(code.charAt(99) === ""); // true
```

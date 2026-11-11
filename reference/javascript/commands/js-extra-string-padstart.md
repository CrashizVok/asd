# String.padStart()

JavaScript command · Strings

Pads the string at the front until it reaches the target length. Useful for fixed width ids and report columns.

## Syntax

```js
text.padStart(length, fill = ' ')
```

## Example

```js
console.log("7".padStart(3, "0"));    // "007"
console.log("42".padStart(5, "*"));   // "***42"
console.log("abc".padStart(2, "0"));  // "abc", already long enough

// Fixed width invoice numbers
const numbers = [7, 42, 1234];
const lines = numbers.map((n) => String(n).padStart(6, "0"));
console.log(lines); // ["000007","000042","001234"]

// padEnd pads the other side
console.log("name".padEnd(10, ".")); // "name......"
```

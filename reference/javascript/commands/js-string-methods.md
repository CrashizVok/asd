# includes, startsWith, endsWith

JavaScript command · Strings

Checks whether a string contains, starts with, or ends with another string. They are case sensitive.

## Syntax

```js
text.includes("word")
```

## Example

```js
const email = "anna@example.com";

console.log(email.includes("@"));       // true
console.log(email.startsWith("anna"));  // true
console.log(email.endsWith(".com"));    // true
```

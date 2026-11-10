# Types

JavaScript topic · Exam Wiki

```js
typeof "hi"        // "string"
typeof 42          // "number"
typeof undefined   // "undefined"
typeof null        // "object" (known quirk)
typeof (() => 1)   // "function"
Array.isArray([])  // true, reliable array check
```
Primitives: string, number, boolean, undefined, null, symbol, bigint. Everything else is an object. Numbers are doubles, so `0.1 + 0.2 !== 0.3`.

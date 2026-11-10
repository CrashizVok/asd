# Operators

JavaScript topic · Exam Wiki

```js
5 % 2      // 1, remainder
2 ** 3     // 8, power
5 == "5"   // true, loose, avoid
5 === "5"  // false, strict, use
null ?? "fallback"   // "fallback"
false || "fallback"  // "fallback"
user?.address?.city  // undefined, no throw
```
`??` falls back only for `null` and `undefined`. `||` falls back for every falsy value, including `0` and `""`, which is a common bug.

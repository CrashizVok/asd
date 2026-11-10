# Spread

JavaScript topic · Exam Wiki

```js
const a = [1, 2];
const b = [...a, 3];                 // [1, 2, 3]
const merged = { ...user, age: 31 }; // shallow copy plus override
Math.max(...a);                      // spread into arguments
```
Spread copies one level. Nested objects still share references.

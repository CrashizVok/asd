# Math and random

JavaScript topic · Exam Wiki

```js
Math.round(4.6);   // 5
Math.floor(4.9);   // 4
Math.ceil(4.1);    // 5
Math.min(3, 1, 2); // 1
Math.max(3, 1, 2); // 3
Math.abs(-5);      // 5
Math.random();     // 0 up to, not including, 1

const dice = Math.floor(Math.random() * 6) + 1; // 1 to 6
const pick = list[Math.floor(Math.random() * list.length)];
```

`Math.random` never returns 1, so `Math.floor(Math.random() * n)` gives 0 to n-1. Add 1 for a dice. For a random array item, multiply by `list.length`.

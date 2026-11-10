# Functions

JavaScript topic · Exam Wiki

```js
function add(a, b = 0) { return a + b; }
const sub = function (a, b) { return a - b; };
function total(...nums) { return nums.reduce((s, n) => s + n, 0); }
```
No `return` gives `undefined`. Extra arguments are ignored. Rest `...` collects the extras into an array.

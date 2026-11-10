# Modules

JavaScript topic · Exam Wiki

```js
// math.js
export const add = (a, b) => a + b;
export default function multiply(a, b) { return a * b; }
// app.js
import multiply, { add } from "./math.js";
```
Named exports need braces on import, the default does not. In the browser the tag needs `type="module"`. In Node use `.mjs` or `"type": "module"` in `package.json`.

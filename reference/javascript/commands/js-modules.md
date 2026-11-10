# import and export

JavaScript command · Modules

Splits code into modules. Use export to expose values and import to use them. In the browser, the script needs type="module".

## Syntax

```js
export function fn() {}
import { fn } from "./file.js";
```

## Example

```js
// math.js
export function add(a, b) {
  return a + b;
}

// app.js
import { add } from "./math.js";
console.log(add(2, 3)); // 5
```

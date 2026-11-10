# setInterval and clearInterval

JavaScript command · Timers

Runs a function repeatedly. Always store the id and clear it when the component or page no longer needs it.

## Syntax

```js
const id = setInterval(fn, 1000)
clearInterval(id)
```

## Example

```js
let seconds = 0;
const id = setInterval(() => {
  seconds++;
  console.log(seconds);
  if (seconds === 3) clearInterval(id);
}, 1000);
```

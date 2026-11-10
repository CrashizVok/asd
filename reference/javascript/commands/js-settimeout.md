# setTimeout and clearTimeout

JavaScript command · Timers

Runs a function once after a delay in milliseconds. clearTimeout cancels it.

## Syntax

```js
const id = setTimeout(fn, 500)
clearTimeout(id)
```

## Example

```js
const id = setTimeout(() => {
  console.log("500 ms later");
}, 500);

// clearTimeout(id); // cancel if needed
```

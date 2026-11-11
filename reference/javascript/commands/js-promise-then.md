# .then()

JavaScript command · Promises

Registers handlers for success and failure and returns a new promise. The handler's return value becomes the next promise's value.

## Syntax

```js
promise.then(onFulfilled, onRejected)
```

## Example

```js
fetch("/api/hotels")
  .then((response) => response.json())
  .then((hotels) => console.log(hotels.length));
```

## Details

Returning a promise from `then` makes the chain wait for it. Forgetting the `return` in a handler written with braces passes `undefined` down the chain.

# .catch()

JavaScript command · Promises

Handles a rejection from this promise or from any earlier link in the chain. It returns a new promise, so a handler that does not rethrow turns the chain back to fulfilled.

## Syntax

```js
promise.catch(onRejected)
```

## Example

```js
fetch("/api/hotels")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .catch((error) => console.error(error.message));
```

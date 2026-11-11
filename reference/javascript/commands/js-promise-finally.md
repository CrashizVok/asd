# .finally()

JavaScript command · Promises

Runs on both outcomes and receives no argument. Use it for cleanup such as hiding a spinner. A value returned from it is ignored.

## Syntax

```js
promise.finally(onFinally)
```

## Example

```js
showSpinner();
loadBookings()
  .then((rows) => render(rows))
  .catch((error) => renderError(error.message))
  .finally(() => hideSpinner());
```

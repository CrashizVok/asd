# AbortController

JavaScript command · fetch

Cancels an in flight request. The promise rejects with an error whose name is AbortError, which is not a failure to show the user.

## Syntax

```js
fetch(url, { signal: controller.signal })
```

## Example

```js
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch("/api/hotels", { signal: controller.signal });
  render(await response.json());
} catch (error) {
  if (error.name !== "AbortError") renderError(error.message);
} finally {
  clearTimeout(timer);
}
```

## Details

Abort is also the cure for a stale search response. Keep one controller per view, call `abort()` when a new request starts, and compare a request token before rendering.

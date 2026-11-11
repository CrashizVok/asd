# AbortController

JavaScript command · Promises

Creates a signal that cancels fetch requests and other async work. Call abort to reject the pending operation with AbortError.

## Syntax

```js
new AbortController()
```

## Example

```js
const controller = new AbortController();

// A timeout cancels the request if the server is slow
const timer = setTimeout(() => controller.abort(), 2000);

try {
  const response = await fetch("/api/hotels", { signal: controller.signal });
  console.log(await response.json());
} catch (error) {
  if (error.name === "AbortError") console.log("Request cancelled");
  else console.log("Request failed", error);
} finally {
  clearTimeout(timer);
}

// abort() can carry a reason for the logs
controller.abort(new Error("user left the page"));
```

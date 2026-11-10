# Promise.all

JavaScript command · Async

Waits for all promises and returns their results in order. It rejects if any promise rejects.

## Syntax

```js
await Promise.all([p1, p2])
```

## Example

```js
const [hotels, bookings] = await Promise.all([
  fetch("/api/hotels").then((r) => r.json()),
  fetch("/api/bookings").then((r) => r.json())
]);
```

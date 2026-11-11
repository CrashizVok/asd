# Promise.all()

JavaScript command · Combinators

Waits for all promises and returns their values in input order. Rejects on the first rejection, and the other promises keep running.

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
console.log(hotels.length, bookings.length);
```

## Details

Order comes from the input array, not from completion. `all` is the right tool when every result is required and one failure should stop the page.

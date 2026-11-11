# Promise.allSettled()

JavaScript command · Combinators

Waits for all promises and never rejects. Each result is { status: "fulfilled", value } or { status: "rejected", reason }.

## Syntax

```js
await Promise.allSettled([p1, p2])
```

## Example

```js
const results = await Promise.allSettled([loadHotels(), loadBookings()]);

const hotels = results[0].status === "fulfilled" ? results[0].value : [];
console.log(hotels, results[1].status);
```

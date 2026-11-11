# parallel await

JavaScript command · async/await

Two independent awaits in a row cost the sum of both waits. Start them together and await once to pay only the slower one.

## Syntax

```js
const [a, b] = await Promise.all([p1, p2])
```

## Example

```js
// slow
const hotels = await loadHotels();
const bookings = await loadBookings();

// fast
const [h, b] = await Promise.all([loadHotels(), loadBookings()]);
```

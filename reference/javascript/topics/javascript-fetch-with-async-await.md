# fetch with async/await

JavaScript topic · Exam Wiki

```js
async function loadRooms() {
  const res = await fetch("/api/rooms");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
async function sendBooking(payload) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Booking failed");
  return res.json();
}
```
`fetch` rejects only on network failure. A 404 resolves, so check `res.ok`. `res.json()` returns a promise, hence the second `await`.

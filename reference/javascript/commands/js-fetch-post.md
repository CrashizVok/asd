# fetch POST JSON

JavaScript command · fetch

Creates a resource. Needs the method, a JSON content type, and a string body. The server parses the body only when the type is correct.

## Syntax

```js
fetch(url, { method: "POST", headers, body: JSON.stringify(data) })
```

## Example

```js
const response = await fetch("/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ first_name: "Anna", hotel_id: 3, adults: 2 })
});
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const saved = await response.json();
```

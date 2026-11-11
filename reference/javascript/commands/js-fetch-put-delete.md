# fetch PUT and DELETE

JavaScript command · fetch

PUT replaces the whole resource. DELETE removes it and often answers 204 with no body, so do not parse it.

## Syntax

```js
fetch(url, { method: "PUT" | "DELETE" })
```

## Example

```js
await fetch(`/api/hotels/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(hotel)
});

const removed = await fetch(`/api/hotels/${id}`, { method: "DELETE" });
if (!removed.ok) throw new Error(`HTTP ${removed.status}`);
```

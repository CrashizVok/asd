# fetch

JavaScript command · Async

Sends an HTTP request. fetch does not reject on 404 or 500; check response.ok.

## Syntax

```js
fetch(url).then(response => response.json())
```

## Example

```js
async function loadHotels() {
  const response = await fetch("/api/hotels");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

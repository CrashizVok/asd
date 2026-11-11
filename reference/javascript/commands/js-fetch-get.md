# fetch GET

JavaScript command · fetch

Sends a GET request and resolves with a Response. GET is the default method, and the body arrives in a second await.

## Syntax

```js
await fetch(url)
```

## Example

```js
async function loadHotels() {
  const response = await fetch("/api/hotels");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

# fetch error handling

JavaScript command · Errors

Separates three failures: a network rejection, an HTTP status with ok false, and a body parse error. Only the first reaches catch on its own.

## Syntax

```js
try { await fetch(url) } catch (error) { ... }
```

## Example

```js
async function getJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`network: ${error.message}`);
  }
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

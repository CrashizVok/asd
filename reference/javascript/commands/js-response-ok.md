# response.ok

JavaScript command · fetch

True for status 200 to 299. fetch does not reject on 404 or 500, so this check is the only thing between an error page and your render.

## Syntax

```js
if (!response.ok) throw new Error(response.status)
```

## Example

```js
const response = await fetch("/api/hotels/99");

if (!response.ok) {
  throw new Error(`hotel not found: HTTP ${response.status}`);
}

const hotel = await response.json();
```

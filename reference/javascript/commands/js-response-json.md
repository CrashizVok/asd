# response.json()

JavaScript command · fetch

Reads and parses the body. The body can be read once, and a malformed body rejects with a SyntaxError.

## Syntax

```js
const data = await response.json()
```

## Example

```js
const response = await fetch("/api/hotels");
if (!response.ok) throw new Error(`HTTP ${response.status}`);

const hotels = await response.json();
console.log(hotels[0].city);
```

# headers

JavaScript command · fetch

Sets request metadata. JSON bodies need Content-Type. Do not set it for FormData, because the browser adds the multipart boundary.

## Syntax

```js
fetch(url, { headers: { "Content-Type": "application/json" } })
```

## Example

```js
const response = await fetch("/api/hotels", {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`
  }
});

console.log(response.headers.get("content-type"));
```

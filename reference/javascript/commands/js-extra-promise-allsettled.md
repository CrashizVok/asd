# Promise.allSettled()

JavaScript command · Promises

Waits for every promise and reports status and value for each one. Promise.all rejects early instead, losing the rest.

## Syntax

```js
Promise.allSettled(iterable)
```

## Example

```js
const load = (url) =>
  url.includes("broken") ? Promise.reject(new Error("500")) : Promise.resolve(url);

const results = await Promise.allSettled([
  load("/api/hotels"),
  load("/broken"),
  load("/api/cities")
]);

console.log(results.map((result) => result.status));
// ["fulfilled","rejected","fulfilled"]

for (const result of results) {
  if (result.status === "fulfilled") console.log(result.value);
  else console.log(result.reason.message); // "500"
}
```

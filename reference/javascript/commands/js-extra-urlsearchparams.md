# URLSearchParams

JavaScript command · Web API

Reads and writes query strings with correct encoding. It removes the manual split, decode, and join steps.

## Syntax

```js
new URLSearchParams(init)
```

## Example

```js
const query = "city=Budapest&stars=4&city=Eger";

const params = new URLSearchParams(query);
console.log(params.get("city"));    // "Budapest", first value only
console.log(params.getAll("city")); // ["Budapest","Eger"]
console.log(params.has("stars"));   // true
console.log(params.get("missing")); // null

// Build a query string for fetch
const filters = new URLSearchParams();
filters.set("city", "Budapest");
filters.set("stars", "4");
console.log(filters.toString()); // "city=Budapest&stars=4"

console.log("/api/hotels?" + filters.toString());
```

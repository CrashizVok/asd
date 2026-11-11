# Object.fromEntries()

JavaScript command · Objects

Builds an object from key and value pairs. It is the inverse of Object.entries and accepts a Map directly.

## Syntax

```js
Object.fromEntries(iterable)
```

## Example

```js
const pairs = [["name", "Danube View"], ["stars", 4], ["city", "Budapest"]];
console.log(Object.fromEntries(pairs));
// { name: "Danube View", stars: 4, city: "Budapest" }

// A Map converts in one call
const lookup = new Map([["HU", "Hungary"], ["AT", "Austria"]]);
console.log(Object.fromEntries(lookup)); // { HU: "Hungary", AT: "Austria" }

// Transform values while rebuilding
const doubled = Object.fromEntries(
  Object.entries({ a: 1, b: 2 }).map(([key, value]) => [key, value * 2])
);
console.log(doubled); // { a: 2, b: 4 }
```

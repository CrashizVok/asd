# JSON.stringify and JSON.parse

JavaScript command · Dates and JSON

Converts a value to JSON text, or parses JSON text into a value. Functions and undefined are dropped by stringify.

## Syntax

```js
JSON.stringify(value)
JSON.parse(text)
```

## Example

```js
const hotel = { name: "Danube View", stars: 4 };
const text = JSON.stringify(hotel);
console.log(text); // {"name":"Danube View","stars":4}

const copy = JSON.parse(text);
console.log(copy.name); // Danube View
```

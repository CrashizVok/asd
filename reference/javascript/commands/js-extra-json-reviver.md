# JSON.parse() with reviver

JavaScript command · JSON

Parses JSON text. The reviver runs on every key and value pair, so dates and numbers can be restored during the parse.

## Syntax

```js
JSON.parse(text, reviver)
```

## Example

```js
const text = '{"name":"Danube View","start_date":"2026-05-01","stars":4}';

// JSON has no date type, so dates arrive as strings
const plain = JSON.parse(text);
console.log(typeof plain.start_date); // "string"

// The reviver converts matching keys while parsing
const hotel = JSON.parse(text, (key, value) => {
  if (key === "start_date") return new Date(value + "T00:00:00Z");
  return value;
});
console.log(hotel.start_date instanceof Date); // true
console.log(hotel.start_date.getUTCFullYear()); // 2026
```

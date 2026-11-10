# destructuring

JavaScript command · Objects

Extracts values from objects or arrays into variables. Use a colon to rename, and = for a default.

## Syntax

```js
const { name, stars } = hotel;
```

## Example

```js
const hotel = { name: "Danube View", stars: 4, city: "Budapest" };
const { name, stars, city: town = "Unknown" } = hotel;

const [first, second] = ["a", "b"];
console.log(name, stars, town, first, second);
```

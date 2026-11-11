# Object.groupBy()

JavaScript command · Objects

Groups items into an object whose keys come from the callback. It replaces the reduce based grouping pattern.

## Syntax

```js
Object.groupBy(items, item => key)
```

## Example

```js
const hotels = [
  { name: "Danube View", city: "Budapest", stars: 4 },
  { name: "City Loft", city: "Budapest", stars: 5 },
  { name: "Valley Inn", city: "Eger", stars: 3 }
];

const byCity = Object.groupBy(hotels, (hotel) => hotel.city);
console.log(byCity.Budapest.length); // 2
console.log(byCity.Eger[0].name);    // Valley Inn

// Missing groups are absent, not empty arrays
console.log(byCity.Gyor); // undefined

// Map.groupBy does the same and keeps non-string keys intact
const byStars = Map.groupBy(hotels, (hotel) => hotel.stars);
console.log(byStars.get(5)[0].name); // City Loft
```

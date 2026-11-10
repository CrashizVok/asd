# filter

JavaScript command · Arrays

Creates a new array with only the items that pass the test.

## Syntax

```js
array.filter(item => condition)
```

## Example

```js
const hotels = [
  { name: "Danube View", stars: 4 },
  { name: "City Loft", stars: 5 },
  { name: "Lake Garden", stars: 3 }
];

const top = hotels.filter((hotel) => hotel.stars >= 4);
console.log(top.length); // 2
```

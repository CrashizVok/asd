# find and findIndex

JavaScript command · Arrays

Returns the first matching item, or undefined. findIndex returns its index, or -1.

## Syntax

```js
array.find(item => condition)
```

## Example

```js
const hotels = [
  { id: 1, name: "Danube View" },
  { id: 2, name: "City Loft" }
];

const hotel = hotels.find((item) => item.id === 2);
console.log(hotel.name); // City Loft
console.log(hotels.findIndex((item) => item.id === 2)); // 1
```

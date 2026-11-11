# array.sort(compare)

JavaScript command · Arrays

Sorts in place. Without a comparator the values are converted to strings, which puts 10 before 2.

## Syntax

```js
array.sort((a, b) => number)
```

## Example

```js
const numbers = [10, 2, 33, 4];

console.log([...numbers].sort());            // [10,2,33,4] as strings, wrong for numbers
console.log([...numbers].sort((a, b) => a - b)); // [2,4,10,33]

const hotels = [
  { name: "Danube View", stars: 4 },
  { name: "City Loft", stars: 5 },
  { name: "Lake Garden", stars: 3 }
];

// sort mutates, so copy first when the original order matters
const byStars = [...hotels].sort((a, b) => b.stars - a.stars);
console.log(byStars.map((hotel) => hotel.name)); // ["City Loft","Danube View","Lake Garden"]
```

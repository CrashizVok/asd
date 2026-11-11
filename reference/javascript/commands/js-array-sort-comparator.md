# sort()

JavaScript command · Order

Sorts in place. With no comparator it compares elements as strings, which is wrong for numbers.

## Syntax

```js
array.sort(compareFn)
```

## Example

```js
// Data shape: list of numbers
const numbers = [10, 9, 1, 100];

console.log([...numbers].sort()); // [1, 10, 100, 9], string order
console.log([...numbers].sort((a, b) => a - b)); // [1, 9, 10, 100]

// Objects by one key, highest first
const hotels = [
  { name: 'Ring', stars: 5 },
  { name: 'Park', stars: 3 },
  { name: 'Garden', stars: 4 },
];

const ranked = [...hotels].sort((a, b) => b.stars - a.stars);
console.log(ranked.map((hotel) => hotel.name)); // ['Ring', 'Garden', 'Park']

console.log(numbers); // [10, 9, 1, 100], the copy above kept it intact
```

## Details

The comparator returns a negative number when `a` comes first, positive when `b` comes first, zero for a tie. `a - b` sorts numbers ascending. Since ES2019 the sort is stable, so equal elements keep their input order. `sort` mutates, so copy with `[...list]` or use `toSorted` when the original order must survive.

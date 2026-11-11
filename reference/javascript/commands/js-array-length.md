# length

JavaScript command · Index and length

Reads the number of slots, which is one more than the highest index. Assigning it truncates or extends the array.

## Syntax

```js
array.length
```

## Example

```js
// Data shape: list of city names
const cities = ['Vienna', 'Graz', 'Linz'];

console.log(cities.length);              // 3
console.log(cities[cities.length - 1]);  // 'Linz'

cities[6] = 'Salzburg';   // writes past the end
console.log(cities.length); // 7, indexes 3 to 5 are holes

cities.length = 2;        // truncates, 'Linz' and the rest are gone
console.log(cities);      // ['Vienna', 'Graz']
```

## Details

`length` is not the count of values when the array has holes. Setting it smaller deletes every element at or above the new length, and setting it larger adds empty slots. Both are silent, so a wrong assignment can destroy data without an error.

# join()

JavaScript command · Strings

Builds one string from all elements, placing the separator between them.

## Syntax

```js
array.join(separator)
```

## Example

```js
// Data shape: list of city names
const cities = ['Vienna', 'Graz', 'Linz'];

console.log(cities.join(', ')); // 'Vienna, Graz, Linz'
console.log(cities.join(' | ')); // 'Vienna | Graz | Linz'
console.log(cities.join(''));    // 'ViennaGrazLinz'

// Missing values become empty text
console.log([1, null, 3].join('-')); // '1--3'
console.log([].join(','));           // ''
```

## Details

The default separator is a comma, so `join()` and `join(',')` give the same result. `null` and `undefined` elements become empty strings rather than the words. `join` is the usual last step of a `map` chain that prints output.

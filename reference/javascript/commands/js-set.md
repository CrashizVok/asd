# Set

JavaScript command · Collections

A collection of unique values. It removes duplicates when built from an array.

## Syntax

```js
const set = new Set(array)
```

## Example

```js
const guests = ["Anna", "Ben", "Anna"];
const unique = [...new Set(guests)];
console.log(unique); // ["Anna", "Ben"]
```

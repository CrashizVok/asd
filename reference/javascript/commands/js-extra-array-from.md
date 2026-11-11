# Array.from()

JavaScript command · Arrays

Builds a real array from an iterable or array-like value. The optional map function runs during the build, so no second pass is needed.

## Syntax

```js
Array.from(iterable, mapFn?)
```

## Example

```js
const letters = Array.from("hotel");
console.log(letters); // ["h","o","t","e","l"]

// The second argument maps each value while the array is built
const stars = Array.from({ length: 5 }, (unused, index) => index + 1);
console.log(stars); // [1,2,3,4,5]

// A Set has no indexes but it is iterable
const unique = Array.from(new Set(["a", "b", "a"]));
console.log(unique); // ["a","b"]
```

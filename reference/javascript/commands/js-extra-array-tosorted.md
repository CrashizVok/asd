# array.toSorted()

JavaScript command · Arrays

Returns a sorted copy and leaves the source array untouched. The same family includes toReversed and toSpliced.

## Syntax

```js
array.toSorted(compare?)
```

## Example

```js
const cities = ["Gyor", "Budapest", "Eger"];

const sorted = cities.toSorted();
console.log(sorted); // ["Budapest","Eger","Gyor"]
console.log(cities); // ["Gyor","Budapest","Eger"], unchanged

// toReversed and toSpliced follow the same copy rule
const reversed = cities.toReversed();
const withoutFirst = cities.toSpliced(0, 1);
console.log(reversed);      // ["Eger","Budapest","Gyor"]
console.log(withoutFirst);  // ["Budapest","Eger"]
```

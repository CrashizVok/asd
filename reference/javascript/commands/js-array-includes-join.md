# includes and join

JavaScript command · Arrays

includes checks for a value. join turns the array into a string with a separator.

## Syntax

```js
array.includes(value)
array.join(", ")
```

## Example

```js
const tags = ["pool", "wifi", "parking"];

console.log(tags.includes("wifi")); // true
console.log(tags.join(" / "));     // pool / wifi / parking
```

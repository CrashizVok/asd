# split, replace, replaceAll

JavaScript command · Strings

split turns a string into an array. replace changes the first match; replaceAll changes every match.

## Syntax

```js
text.split(",")
text.replace("a", "b")
```

## Example

```js
const line = "Anna,Budapest,4";
const parts = line.split(",");
console.log(parts); // ["Anna", "Budapest", "4"]

const text = "a-b-c";
console.log(text.replace("-", "+"));    // a+b-c
console.log(text.replaceAll("-", "+")); // a+b+c
```

# String.replaceAll()

JavaScript command · Strings

Replaces every match. With a string search it needs no regular expression and no global flag.

## Syntax

```js
text.replaceAll(search, replacement)
```

## Example

```js
const path = "hotels/2026/may/hotels.csv";

console.log(path.replace("/", "_"));      // hotels_2026/may/hotels.csv, first only
console.log(path.replaceAll("/", "_"));   // hotels_2026_may_hotels.csv

// A regular expression still works and adds patterns
console.log("a1 b2 c3".replaceAll(/\d/g, "#")); // "a# b# c#"

// The replacement can use $& for the whole match
console.log("cat".replaceAll("a", "[$&]")); // "c[a]t"
```

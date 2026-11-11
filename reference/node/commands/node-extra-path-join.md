# path.join

Node.js command · Path

Joins path segments with the platform separator and normalizes dots. It never produces a leading slash unless a part is absolute.

## Syntax

```js
path.join(...parts)
```

## Example

```js
// File: src/paths.js
import path from "node:path";

// On Linux the separator is /, on Windows it is \
const file = path.join("data", "2026", "hotels.csv");
console.log(file); // "data/2026/hotels.csv"

// Redundant separators and dot segments are cleaned up
console.log(path.join("data", "..", "data", "hotels.csv"));
// "data/hotels.csv"

// join does not resolve an absolute root, that is path.resolve
console.log(path.join("data", "/etc", "passwd"));
// "data/etc/passwd" on Linux
```

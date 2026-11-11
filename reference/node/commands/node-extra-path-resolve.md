# path.resolve

Node.js command · Path

Builds an absolute path from the current working directory. Later absolute parts replace everything before them.

## Syntax

```js
path.resolve(...parts)
```

## Example

```js
// File: src/absolute.js
import path from "node:path";

// The result depends on process.cwd()
const target = path.resolve("data", "hotels.csv");
console.log(target); // "/home/student/app/data/hotels.csv"

// An absolute part resets the chain
console.log(path.resolve("data", "/tmp/hotels.csv")); // "/tmp/hotels.csv"

// Useful to compare two paths built in different ways
const a = path.resolve("data", "..", "data", "hotels.csv");
const b = path.resolve("data/hotels.csv");
console.log(a === b); // true
```

# path.basename, dirname, extname

Node.js command · Path

Splits a path into its pieces without touching the disk. basename takes an optional suffix to strip.

## Syntax

```js
path.basename(file), path.dirname(file), path.extname(file)
```

## Example

```js
// File: src/split-path.js
import path from "node:path";

const file = "/srv/app/data/hotels.csv";

console.log(path.basename(file));        // "hotels.csv"
console.log(path.basename(file, ".csv")); // "hotels"
console.log(path.dirname(file));         // "/srv/app/data"
console.log(path.extname(file));         // ".csv"

// Swap the extension when building an output name
const target = path.join(
  path.dirname(file),
  path.basename(file, ".csv") + ".json"
);
console.log(target); // "/srv/app/data/hotels.json"

// A dotfile has no extension by this rule
console.log(path.extname(".env")); // ""
```

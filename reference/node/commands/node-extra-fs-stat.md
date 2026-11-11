# fs.stat

Node.js command · File system

Returns metadata for a path: size in bytes, timestamps, and type checks. It follows symlinks, lstat does not.

## Syntax

```js
await stat(path)
```

## Example

```js
// File: src/file-info.js
import { stat } from "node:fs/promises";

const info = await stat("data/hotels.csv");

console.log(info.size);          // bytes, not characters
console.log(info.isFile());      // true
console.log(info.isDirectory()); // false
console.log(info.mtime);         // Date of the last write

// Days since the last change
const days = (Date.now() - info.mtime.getTime()) / 86400000;
console.log(Math.floor(days));

// A missing path rejects, check with a try or use access first
```

# fs.readFile

Node.js command · File system

Reads a whole file into memory. Without an encoding it returns a Buffer, which is the usual reason console.log prints numbers.

## Syntax

```js
await readFile(path, 'utf8')
```

## Example

```js
// File: src/read-hotels.js
import { readFile } from "node:fs/promises";

// The encoding must be passed, otherwise you get a Buffer
const text = await readFile("data/hotels.csv", "utf8");

const rows = text.trim().split("\n");
const header = rows[0].split(",");
console.log(header);      // ["name","city","stars"]
console.log(rows.length); // includes the header

// A missing file rejects with code ENOENT
try {
  await readFile("data/missing.csv", "utf8");
} catch (error) {
  console.log(error.code); // "ENOENT"
}
```

# fs.readdir

Node.js command · File system

Lists directory entries. withFileTypes returns Dirent objects, so files and folders can be told apart without another stat call.

## Syntax

```js
await readdir(path, { withFileTypes: true })
```

## Example

```js
// File: src/list-data.js
import { readdir } from "node:fs/promises";

const entries = await readdir("data", { withFileTypes: true });

const files = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name);

const folders = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

console.log(files);   // ["hotels.csv","cities.csv"]
console.log(folders); // ["archive"]

// The default form returns names only, no type information
console.log(await readdir("data"));
```

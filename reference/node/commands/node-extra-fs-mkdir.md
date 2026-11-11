# fs.mkdir

Node.js command · File system

Creates a directory. recursive creates missing parents and does not throw when the directory already exists.

## Syntax

```js
await mkdir(path, { recursive: true })
```

## Example

```js
// File: src/ensure-out.js
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// recursive avoids ENOENT for out/2026/may
await mkdir("out/2026/may", { recursive: true });

const target = path.join("out", "2026", "may", "report.txt");
await writeFile(target, "hotels: 12\n", "utf8");

// Without recursive, a missing parent rejects with ENOENT
// and an existing directory rejects with EEXIST
try {
  await mkdir("out/2026/may");
} catch (error) {
  console.log(error.code); // "EEXIST"
}
```

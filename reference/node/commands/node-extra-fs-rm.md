# fs.rm

Node.js command · File system

Deletes a file or directory. recursive removes a tree and force ignores a missing path, so the call is safe to repeat.

## Syntax

```js
await rm(path, { recursive: true, force: true })
```

## Example

```js
// File: src/clean-build.js
import { rm } from "node:fs/promises";

// force makes a missing target a no op, recursive removes folders
await rm("out", { recursive: true, force: true });

// Deleting one file needs no flags
await rm("out/report.txt", { force: true });

// fs.rm replaces the deprecated fs.rmdir for recursive deletes
// Without force, a missing path rejects with ENOENT
try {
  await rm("out/missing.txt");
} catch (error) {
  console.log(error.code); // "ENOENT"
}
```

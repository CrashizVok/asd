# rm()

Node.js command · Directories

Removes a file or, with recursive true, a whole directory tree. force true ignores a missing target.

## Syntax

```js
await rm(path, { recursive?, force? })
```

## Example

```js
import { rm } from 'node:fs/promises';

// Delete one file. Missing file is an error without force.
await rm('out/report.json', { force: true });

// Delete a directory and everything in it.
await rm('out/tmp', { recursive: true, force: true });
```

## Details

There is no undo and no trash folder. Build the path from a known root and print it in a log before a recursive delete. `force` hides `ENOENT`, not permission errors.

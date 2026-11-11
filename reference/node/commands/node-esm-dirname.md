# import.meta.url

Node.js command · Modules

Gives the folder of the current ES module file, the ESM replacement for __dirname.

## Syntax

```js
const here = path.dirname(fileURLToPath(import.meta.url));
```

## Example

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The current file's folder, regardless of where node was started.
const here = path.dirname(fileURLToPath(import.meta.url));

// Read a file that sits beside the source, not beside the shell.
const sqlFile = path.join(here, 'schema.sql');
console.log(sqlFile);
```

## Details

`import.meta.url` is a `file://` URL, so `fileURLToPath` converts it before `path.dirname` can be used. Skipping that step produces paths such as `file:/home/user/project`, which most file APIs reject.

Avoid absolute paths built from `process.cwd()` when the file must be found next to the code, because the working directory depends on where npm was started.

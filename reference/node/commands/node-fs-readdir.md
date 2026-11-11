# readdir()

Node.js command · Directories

Lists a directory. With withFileTypes the result contains Dirent objects that know whether an entry is a file or a folder.

## Syntax

```js
await readdir(path, { withFileTypes: true })
```

## Example

```js
import { readdir } from 'node:fs/promises';

const entries = await readdir('data', { withFileTypes: true });

for (const entry of entries) {
    if (entry.isDirectory()) console.log('dir ', entry.name);
    else if (entry.isFile()) console.log('file', entry.name);
}

// Plain names when the type is not needed:
const names = await readdir('data');
console.log(names.filter((name) => name.endsWith('.csv')));
```

## Details

The order is whatever the filesystem returns, so sort before printing. `withFileTypes` avoids a `stat` call per entry, which matters in a folder with thousands of files.

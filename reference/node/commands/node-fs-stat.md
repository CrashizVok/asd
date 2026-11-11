# stat()

Node.js command · Directories

Returns size in bytes, modification time as a Date, and type checks. Follows symbolic links; lstat does not.

## Syntax

```js
const info = await stat(path)
```

## Example

```js
import { stat } from 'node:fs/promises';

const info = await stat('bookings.csv');

console.log(info.size);              // bytes, not characters
console.log(info.mtime.toISOString());
console.log(info.isFile(), info.isDirectory());

// Guard before reading a path that might be a folder:
if (info.isDirectory()) throw new Error('expected a file');
```

## Details

`stat` fails with `ENOENT` for a missing path, so use it to test existence only when you accept that race: the file can disappear between the check and the read. Handling `ENOENT` on the read itself is more reliable.

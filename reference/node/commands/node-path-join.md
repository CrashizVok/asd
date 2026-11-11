# path.join()

Node.js command · Paths

Joins path segments with the platform separator and normalizes the result. Relative segments stay relative.

## Syntax

```js
path.join(...segments)
```

## Example

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM has no __dirname, so build it once from the module URL.
const here = path.dirname(fileURLToPath(import.meta.url));

const input = path.join(here, '..', 'data', 'bookings.csv');
console.log(input); // /home/student/project/data/bookings.csv

// In CommonJS the same line is: path.join(__dirname, 'data', 'bookings.csv')
```

## Details

Joining with `+ "/" +` produces doubled separators and breaks on Windows. `join` also collapses `..`, which is what you want for a path built from parts.

# copyFile()

Node.js command · Files

Copies a file byte for byte. With the COPYFILE_EXCL constant it fails instead of overwriting an existing target.

## Syntax

```js
await copyFile(source, target, mode?)
```

## Example

```js
import { copyFile, constants } from 'node:fs/promises';

// Overwrite the target when it exists.
await copyFile('template.csv', 'bookings.csv');

// Refuse to overwrite: throws EEXIST when bookings.csv is already there.
await copyFile('template.csv', 'bookings.csv', constants.COPYFILE_EXCL);
```

## Details

Use `copyFile` for a file, not `readFile` plus `writeFile`: the built-in copy does not build the content in memory and lets the platform use its fastest path.

# mkdir()

Node.js command · Directories

Creates a directory, and with recursive true creates every missing parent and does not fail when the directory already exists.

## Syntax

```js
await mkdir(path, { recursive: true })
```

## Example

```js
import { mkdir } from 'node:fs/promises';

// Without recursive, a missing parent fails with ENOENT.
await mkdir('out', { recursive: true });

// Safe to call on every run: no error when the tree exists.
await mkdir('out/reports/2026', { recursive: true });
```

## Details

A write into a missing directory fails with `ENOENT`, and the message points at the file, not at the folder. Create the output directory before the first write of a script, not after the first failure.

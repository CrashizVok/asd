# readFile() (promises)

Node.js command · Files

Reads the whole file and resolves to a Buffer, or to a string when an encoding is given. Rejects with a coded error such as ENOENT when the read fails.

## Syntax

```js
const data = await readFile(path, options?)
```

## Example

```js
import { readFile } from 'node:fs/promises';

// No encoding: a Buffer of raw bytes.
const bytes = await readFile('photo.bin');

// With utf8: a string. This is the form used for text, JSON and CSV.
const text = await readFile('notes.txt', 'utf8');
console.log(bytes.length, text.length); // bytes vs characters

try {
    await readFile('missing.txt', 'utf8');
} catch (err) {
    if (err.code === 'ENOENT') console.error('file is not there');
    else throw err; // do not swallow permission or disk errors
}
```

## Details

The import path matters: `node:fs/promises` gives the promise API directly, while `require('fs').promises` reaches the same functions through a property.

The whole file is loaded, so the memory cost is the file size plus a copy when an encoding is used. For a file above a few tens of megabytes, use `createReadStream` and `pipeline` instead.

A UTF-8 file saved by Excel can start with a byte order mark. Strip it with `text.replace(/^\uFEFF/, '')` before `JSON.parse`.

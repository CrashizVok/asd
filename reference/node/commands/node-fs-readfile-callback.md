# readFile() (callback)

Node.js command · Files

The original error-first form. The callback receives (err, data) and is called once.

## Syntax

```js
readFile(path, options?, callback)
```

## Example

```js
import { readFile } from 'node:fs';

// Error-first callback: check err before touching data.
readFile('notes.txt', 'utf8', (err, text) => {
    if (err) {
        console.error(err.code, err.message);
        return;
    }
    console.log(text.split('\n').length, 'lines');
});
```

## Details

Wrap it with `util.promisify` when the surrounding code is async, or import from `node:fs/promises` and skip the wrapper entirely.

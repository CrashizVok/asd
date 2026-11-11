# writeFile()

Node.js command · Files

Writes data to a file, creating it when missing and truncating it when present. Accepts a string or a Buffer.

## Syntax

```js
await writeFile(path, data, options?)
```

## Example

```js
import { writeFile } from 'node:fs/promises';

const report = { hotel_id: 3, bookings: 12, guests: 27 };

// Objects must be serialized first; writeFile rejects a plain object.
await writeFile('report.json', JSON.stringify(report, null, 2) + '\n');

// Append instead of replace, and fail instead of overwriting:
await writeFile('out.csv', 'hotel_id,bookings\n', { flag: 'a' });
await writeFile('report.json', '{}', { flag: 'wx' }); // EEXIST if it exists
```

## Details

The default flag is `w`: the old content is gone as soon as the call starts. For an output another process reads, write a temporary file in the same directory and `rename` it into place, so the target is never half written.

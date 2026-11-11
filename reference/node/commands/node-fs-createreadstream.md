# createReadStream()

Node.js command · Streams

Reads a file in chunks instead of loading it whole. Chunks are Buffers unless an encoding is set.

## Syntax

```js
createReadStream(path, { encoding?, highWaterMark? })
```

## Example

```js
import { createReadStream } from 'node:fs';

let lines = 0;
const stream = createReadStream('access.log', { encoding: 'utf8' });

// for await pauses and resumes the stream, so memory stays flat.
for await (const chunk of stream) {
    lines += chunk.split('\n').length - 1;
}
console.log({ lines }); // note: counts only complete newlines in chunks
```

## Details

Chunk boundaries fall anywhere, so counting lines per chunk gives a wrong total for the last line. Use `readline.createInterface` when the unit is a line and `pipeline` when the data only needs to move.

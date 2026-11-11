# pipeline()

Node.js command · Streams

Connects streams, handles backpressure, forwards errors, and destroys every stage when one fails. Resolves when the destination is finished.

## Syntax

```js
await pipeline(source, ...transforms, destination, options?)
```

## Example

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

// Copy and compress in one pass, with one error handler.
await pipeline(
    createReadStream('access.log'),
    createGzip(),
    createWriteStream('access.log.gz'),
);

// Cancellation: the signal destroys every stage and releases the handles.
const controller = new AbortController();
await pipeline(createReadStream('big.csv'), createWriteStream('copy.csv'), {
    signal: controller.signal,
});
```

## Details

`pipe` forwards data but not errors, and leaves the other streams open after a failure. `pipeline` closes all of them, which is why a failed run does not hang the process. Pass an async generator function as a stage when a full `Transform` class is more code than the job needs.

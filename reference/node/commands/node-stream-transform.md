# new Transform()

Node.js command · Streams

A stream stage that takes a chunk in and emits zero or more chunks out. The callback must be called exactly once.

## Syntax

```js
new Transform({ transform(chunk, encoding, callback) })
```

## Example

```js
import { Transform } from 'node:stream';

// Buffer the unfinished tail: a chunk can end in the middle of a line.
const splitLines = new Transform({
    transform(chunk, encoding, callback) {
        this.rest = (this.rest ?? '') + chunk.toString();
        const lines = this.rest.split('\n');
        this.rest = lines.pop();
        callback(null, lines.length ? lines.join('\n') + '\n' : undefined);
    },
    flush(callback) {
        // The last line may arrive without a trailing newline.
        callback(null, this.rest || undefined);
    },
});
```

## Details

Holding state between chunks is allowed, but the leftover must be flushed in `flush` or it is silently dropped. Forgetting to call the callback stalls the pipeline with no error, which looks like a hang rather than a bug.

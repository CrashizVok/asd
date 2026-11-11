# Streams and large files

Node.js topic · Exam Wiki

`readFile` is a single promise: open, read everything, close. That is the right call for a settings file and the wrong one for a 4 GB log, because the whole content has to exist in memory at once, and the string version makes a second copy.

Streams flip the model. The file is read in chunks of a few kilobytes, each chunk is processed and released, and memory stays flat no matter how large the input is. The same code works for a file, an HTTP request, a gzip stream and standard input, which is why Node uses streams for so much of its own API.

This page is about pushing data through those chunks without losing any: `createReadStream`, `createWriteStream`, `pipeline`, `Transform`, backpressure, error propagation and early exit.

## Simplest form

```js
// ESM. Data shape: chunks are Buffers; pipeline resolves when the destination is fully written.
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

await pipeline(createReadStream('big.csv'), createWriteStream('copy.csv'));
```

The CommonJS import is the same module, and `pipeline` also exists in callback form on `node:stream`. The promise version is shorter and rejects on the first error, so use it when the surrounding code is `async`.

## What it does

A readable stream is an object that produces data in pieces and lets the consumer decide how fast to take them. A writable stream accepts pieces and reports when its internal buffer is full. `pipeline` connects them, forwards errors both ways, and destroys every stage when one fails.

The pieces are called chunks. For a file stream without an encoding they are `Buffer` objects, typically 64 KiB each. With `{ encoding: 'utf8' }` they are strings, and a multi-byte character can be split across two chunks, which is why string chunks are only safe when you concatenate them before parsing.

Memory stays flat because the reader stops when the writer's buffer is full. That mechanism is backpressure, and it is the reason a 2 GB copy runs in 30 MB of heap.

## Every part

### Reading and writing

```js
import { createReadStream, createWriteStream } from 'node:fs';

const input = createReadStream('access.log', { encoding: 'utf8', highWaterMark: 64 * 1024 });
const output = createWriteStream('access-copy.log');
```

`highWaterMark` is the buffer size in bytes, and also the largest chunk the stream will hand out. The default is 64 KiB on current Node. Raising it means fewer callbacks and more memory per stream; lowering it is useful when many streams run at once. For text processing, the default is almost always fine.

`start` and `end` on `createReadStream` read a byte range. `flags` picks the open mode, and `autoClose: false` keeps the descriptor open after the stream ends, which you rarely want.

### Events you actually use

A readable stream emits `data` when a chunk arrives, `end` when there is no more, `error` on failure, and `close` when the underlying handle is released. A writable stream emits `finish` when all data is flushed to the operating system, `error`, and `close`.

`finish` is not `close`. A write stream can be finished while the descriptor is still open. In a `pipeline`, wait for the promise; the details are already handled.

The event style is the old way. Prefer `for await (const chunk of stream)`, which pauses and resumes the source for you and throws on error:

```js
import { createReadStream } from 'node:fs';

let bytes = 0;
for await (const chunk of createReadStream('access.log')) {
    bytes += chunk.length; // Buffer length is bytes, not characters
}
console.log(bytes);
```

Breaking out of that loop destroys the stream. That is the desired behavior, and it is one more thing `pipeline` and the iterator get right without extra code.

### Backpressure, and the one method that matters

`writable.write(chunk)` returns `false` when the internal buffer has passed its high water mark. That is not an error; it is a request to stop writing until the `drain` event fires.

```js
import { createWriteStream } from 'node:fs';

const out = createWriteStream('numbers.txt');
for (let i = 0; i < 1_000_000; i += 1) {
    const ok = out.write(`${i}\n`);
    if (!ok) {
        // Wait for the buffer to empty before producing more.
        await new Promise((resolve) => out.once('drain', resolve));
    }
}
out.end(); // no more data; 'finish' follows
```

Ignoring the return value is the classic leak. The loop keeps producing strings faster than the disk accepts them, the writable's buffer grows without limit, and the process dies with a heap out of memory on a file that should have streamed fine.

`pipeline` and `for await` implement this waiting already. Manual `write` loops only appear when the source is not a stream, as above.

### pipeline versus pipe

`readable.pipe(writable)` connects two streams but forwards errors only in one direction and leaves the other streams open after a failure. `pipeline` destroys every stage, forwards the error to the returned promise, and accepts more than two stages.

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

// Source, transform, transform, destination. One error handler for all four.
await pipeline(
    createReadStream('access.log'),
    createGzip(),
    createWriteStream('access.log.gz'),
);
```

Use `pipe` only in old code you are not touching. New code uses `pipeline` or `stream.compose`, because a half-open stream after an error is a file descriptor leak and a silent hang.

### Transform streams

A `Transform` is a readable and a writable at once: it takes a chunk in, produces zero or more chunks out. Subclass it and implement `_transform`, or build one with a function.

```js
import { Transform } from 'node:stream';

// Data shape: text chunk in, uppercase text chunk out.
const upper = new Transform({
    transform(chunk, encoding, callback) {
        callback(null, chunk.toString().toUpperCase());
    },
});
```

The callback must be called exactly once, with an error or with output. Forgetting it stalls the stream forever, and the symptom is a process that exits with no error and no output.

Two rules keep transforms correct. Never hold state across chunks unless you can flush it in `_flush`, and never assume a chunk ends on a line boundary. A chunk of a CSV can end in the middle of a field.

```js
const splitLines = new Transform({
    transform(chunk, encoding, callback) {
        this.rest = (this.rest ?? '') + chunk.toString();
        const lines = this.rest.split('\n');
        this.rest = lines.pop(); // keep the unfinished tail for the next chunk
        callback(null, lines.join('\n') + (lines.length ? '\n' : ''));
    },
    flush(callback) {
        if (this.rest) callback(null, this.rest); // last line without a trailing newline
        else callback();
    },
});
```

Node 16 and later also accept async generator functions wherever `pipeline` expects a stream, which removes most of the class boilerplate:

```js
await pipeline(
    createReadStream('access.log', 'utf8'),
    async function* (source) {
        for await (const chunk of source) yield chunk.toUpperCase();
    },
    createWriteStream('access-upper.log'),
);
```

### Object mode

Byte streams move `Buffer` and string chunks. Object mode moves arbitrary values, one object per chunk. `highWaterMark` then counts objects, not bytes.

```js
import { Readable } from 'node:stream';

// Data shape: each chunk is a row object, not a line of text.
const rows = Readable.from([{ id: 1 }, { id: 2 }, { id: 3 }]);
for await (const row of rows) console.log(row.id);
```

`Readable.from(iterable)` is the shortest bridge from an array or generator to a stream, and it is how tests feed a pipeline without touching the disk.

### readline on top of a stream

`readline.createInterface({ input })` gives an async iterator of lines and handles the buffering, including the split line at a chunk boundary. It is the smallest amount of code that reads a large text file record by record.

```js
import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: createReadStream('access.log', 'utf8'),
    crlfDelay: Infinity,
});

for await (const line of rl) {
    if (line.length === 0) continue;
    // process one record
}
```

`crlfDelay: Infinity` merges `\r\n` into a single break. Without it, a Windows file leaves `\r` at the end of every line and every string comparison quietly fails.

### Errors and early exit

Errors arrive in three places, and a script must survive all three: the source cannot be opened (`ENOENT`), a transform throws, or the destination cannot be written (`ENOSPC`, `EACCES`). With `pipeline`, all three reject the same promise. With manual events, each stream needs its own `error` listener or the process crashes with an unhandled `error`.

```js
import { pipeline } from 'node:stream/promises';

const controller = new AbortController();

try {
    await pipeline(source, transform, destination, { signal: controller.signal });
} catch (err) {
    if (err.name === 'AbortError') {
        // Canceled on purpose. The partial output is expected.
    } else {
        console.error('copy failed:', err.code ?? err.message);
    }
}
```

Passing a `signal` makes the whole chain cancelable, and `pipeline` destroys every stage, which releases the file descriptors. Without the destroy step, a canceled copy keeps the output file open and the next run may find a locked or truncated file.

A failed pipeline leaves a partial destination file. When the output must not exist unless complete, write to a temporary name and rename after the promise resolves, exactly as in the file I/O page.

## Examples

### Example 1: copy with progress

```js
// copy-progress.js. Byte count from a Transform, progress printed to stderr.
import { createReadStream, createWriteStream, statSync } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const from = process.argv[2];
const to = process.argv[3];
const total = statSync(from).size;

let copied = 0;
let lastPrint = 0;

const meter = new Transform({
    transform(chunk, encoding, callback) {
        copied += chunk.length;
        // Print at most every 8 MiB so the terminal is not the bottleneck.
        if (copied - lastPrint >= 8 * 1024 * 1024) {
            lastPrint = copied;
            process.stderr.write(`${Math.round((copied / total) * 100)}%\n`);
        }
        callback(null, chunk);
    },
});

await pipeline(createReadStream(from), meter, createWriteStream(to));
process.stderr.write(`done: ${copied} of ${total} bytes\n`);
```

Progress belongs on stderr, not stdout, so a script that pipes stdout into another program does not mix numbers with data.

### Example 2: filter a CSV stream into JSON Lines

```js
// csv-filter.js. Keep rows for one hotel, write one JSON object per line.
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

// Data shape in: header row plus comma separated rows.
// Data shape out: {"booking_id":"7","hotel_id":"3",...} one per line.
const keepHotel = 3;

class HotelFilter extends Transform {
    constructor(hotelId) {
        super();
        this.hotelId = hotelId;
        this.header = null;
        this.rest = '';
    }

    transform(chunk, encoding, callback) {
        this.rest += chunk.toString();
        const lines = this.rest.split('\n');
        this.rest = lines.pop(); // incomplete last line stays in the buffer

        const out = [];
        for (const line of lines) {
            const clean = line.replace(/\r$/, '');
            if (clean === '') continue;

            if (this.header === null) {
                this.header = clean.split(',');
                continue; // header never reaches the output
            }

            const cells = clean.split(',');
            const row = Object.fromEntries(this.header.map((name, i) => [name, cells[i]]));
            if (Number(row.hotel_id) === this.hotelId) out.push(JSON.stringify(row));
        }

        callback(null, out.length ? out.join('\n') + '\n' : undefined);
    }

    flush(callback) {
        callback(); // a trailing line without a newline is dropped on purpose here
    }
}

await pipeline(
    createReadStream('bookings.csv'),
    new HotelFilter(keepHotel),
    createWriteStream('hotel-3.jsonl'),
);
```

Calling `callback(null, undefined)` with no output is legal and keeps the stream flowing. Returning an empty string also works, but it writes a zero-length chunk, which some destinations treat as a no-op and others do not.

### Example 3: the longest line without loading the file

```js
// longest-line.js. Memory stays flat: one line and one candidate at a time.
import { createReadStream } from 'node:fs';
import readline from 'node:readline';

// Data shape: { line: string, length: number, number: number }
let best = { line: '', length: 0, number: 0 };
let number = 0;

const rl = readline.createInterface({
    input: createReadStream(process.argv[2] ?? 'access.log', 'utf8'),
    crlfDelay: Infinity,
});

for await (const line of rl) {
    number += 1;
    if (line.length > best.length) best = { line, length: line.length, number };
}

console.log({ number: best.number, length: best.length });
console.log(best.line.slice(0, 120));
```

This reads a 2 GB file with a few kilobytes of heap. The `readFile` version would need 2 GB plus the string copy, and would likely fail before printing anything.

### Example 4: a streaming log analyzer with a summary

The script below reads a web server log line by line, parses the fields it needs, keeps counters in memory, writes only the suspicious lines to a file, enforces a cap on bad lines, supports Ctrl+C, and prints a JSON summary at the end. Every stage is a stream, so the run stays at a few megabytes of memory regardless of input size.

```js
// analyze.js. Run with: node analyze.js access.log out/report.json
import { createReadStream, createWriteStream, statSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

// A common combined log line:
// 10.0.0.5 - - [12/Nov/2026:10:04:11 +0000] "GET /hotels?city=Budapest HTTP/1.1" 200 512
const LINE = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) [^"]*" (\d{3}) (\d+|-)$/;

const inputPath = process.argv[2] ?? 'access.log';
const reportPath = process.argv[3] ?? 'out/report.json';
const maxBadLines = 500;

const stats = {
    total: 0,
    parsed: 0,
    bad: 0,
    byStatus: {},   // '200' -> count
    byMethod: {},   // 'GET' -> count
    bytes: 0,
};

function bump(bucket, key) {
    bucket[key] = (bucket[key] ?? 0) + 1;
}

// Parse one line. Returns null when the shape does not match instead of throwing,
// because one malformed line should not end a 500 MB run.
function parseLine(line) {
    const match = LINE.exec(line);
    if (!match) return null;
    const [, ip, time, method, url, status, size] = match;
    return {
        ip,
        time,
        method,
        url,
        status,
        bytes: size === '-' ? 0 : Number(size),
    };
}

// Stage 1: text in, record objects out. The line buffer keeps a line that was
// split across chunks together; readableObjectMode hands objects to the next stage.
function handleLine(stream, line) {
    if (line.trim() === '') return null;
    stats.total += 1;

    const record = parseLine(line.replace(/\r$/, ''));
    if (record === null) {
        stats.bad += 1;
        return stats.bad > maxBadLines
            ? new Error(`more than ${maxBadLines} unparseable lines, check the format`)
            : null;
    }

    stats.parsed += 1;
    stats.bytes += record.bytes;
    bump(stats.byStatus, record.status);
    bump(stats.byMethod, record.method);
    stream.push(record);
    return null;
}

const parse = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
        this.rest = (this.rest ?? '') + chunk.toString();
        const lines = this.rest.split('\n');
        this.rest = lines.pop(); // last piece may be an incomplete line

        for (const line of lines) {
            const error = handleLine(this, line);
            if (error) return callback(error); // stops the pipeline at the threshold
        }
        callback();
    },
    flush(callback) {
        const error = this.rest ? handleLine(this, this.rest) : null;
        callback(error ?? undefined);
    },
});

// Stage 2: keep only server errors. Object mode on the writable side, text on
// the readable side, so the destination is a plain file.
const failures = new Transform({
    writableObjectMode: true,
    transform(record, encoding, callback) {
        callback(null, Number(record.status) >= 500 ? JSON.stringify(record) + '\n' : undefined);
    },
});

const controller = new AbortController();
process.once('SIGINT', () => {
    // Cancel the chain, then let the finally block report what was counted.
    controller.abort();
});

const started = Date.now();
let failed = null;

try {
    await mkdir(path.dirname(reportPath), { recursive: true });
    await pipeline(
        createReadStream(inputPath, { encoding: 'utf8', highWaterMark: 128 * 1024 }),
        parse,
        failures,
        createWriteStream(path.join(path.dirname(reportPath), 'server-errors.log')),
        { signal: controller.signal },
    );
} catch (err) {
    if (err.name !== 'AbortError') failed = err;
} finally {
    // The report is written even after an abort, and it says whether the run was complete.
    const report = {
        source: inputPath,
        input_bytes: (() => {
            try {
                return statSync(inputPath).size;
            } catch {
                return null;
            }
        })(),
        complete: failed === null && !controller.signal.aborted,
        error: failed ? (failed.code ?? failed.message) : null,
        elapsed_ms: Date.now() - started,
        ...stats,
        top_status: Object.entries(stats.byStatus).sort((a, b) => b[1] - a[1]).slice(0, 5),
    };

    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report.top_status));
    if (failed) process.exitCode = 1;
}
```

Three details make this script usable under pressure. The malformed line counter turns a silent wrong answer into an explicit failure with a threshold. The `finally` block still produces a report after Ctrl+C, marked `complete: false`, so half a run is not mistaken for a full one. And the parser is a function, so the two transforms share one definition of the format.

## Common mistakes

- Waiting for `close` instead of `finish` on a writable, then reading the file before the last chunk is flushed. `pipeline` resolves at the right moment; manual code should use `finish` or the callback of `end`.
- Ignoring the boolean from `write()`. The buffer grows until the process dies. Respect `drain`.
- Splitting each chunk on `\n` and parsing the last piece. Chunks end anywhere, so the tail belongs to the next chunk.
- Holding every line in an array "for later". That is `readFile` with extra steps and the same memory cost.
- Using `pipe` and no `error` listener on the destination. A failed write leaves the source running and the process hanging.
- Reading a file with `{ encoding: 'utf8' }` and then slicing by byte offset. String indices are not byte offsets.
- Assuming `highWaterMark` is the chunk size. It is the buffer limit and an upper bound on the chunk, not a guarantee.
- Forgetting `_flush`, so the final buffered line never leaves the transform.
- Letting a `Transform` callback be called twice or never. Both are silent until the stream stalls or throws `ERR_MULTIPLE_CALLBACK`.
- Starting a second pipeline on the same writable. One writable, one producer; use two files or a demultiplexer.
- Not destroying the chain on cancel. The file descriptor survives and the next run sees a truncated output.
- Measuring success by exit code alone when the pipeline wrote a partial report. Write the report only after the pipeline resolves, or mark it incomplete.

## Exam checklist

- `createReadStream(path, options)` produces `Buffer` chunks by default; pass `encoding` for strings.
- `highWaterMark` is a byte limit for file streams and an object count in object mode.
- `pipeline` from `node:stream/promises` is awaited, rejects on any stage error, and destroys all stages.
- A writable emits `finish` when flushed and `close` when the handle is released; they are not the same event.
- `write()` returning `false` means wait for `drain`, not retry or ignore.
- A `Transform` implements `_transform(chunk, encoding, callback)` and optionally `_flush(callback)`, and calls the callback exactly once.
- Chunk boundaries are arbitrary. Buffer the partial line between chunks.
- `readline.createInterface({ input, crlfDelay: Infinity })` is the shortest correct line reader over a file stream.
- `Readable.from(iterable)` turns an array or generator into a stream for tests and small data sets.
- An `AbortController` signal passed to `pipeline` cancels every stage and releases the descriptors.
- Cancellation and failure destroy the pipeline but leave partial output; rename a temp file or mark the report incomplete.
- `statSync` for a size before the copy, `process.stderr` for progress, `process.exitCode = 1` for failure.


# Read and write files in Node.js

Node.js topic · Exam Wiki

A backend task usually starts and ends with a file: a settings file, a CSV the teacher gave you, a log you append to, a JSON report you must produce. Node ships everything needed for that in `node:fs` and `node:path`, so no dependency is required.

This page covers the three ways the same operation is exposed (promises, callbacks, sync), how encoding decides whether you get a string or a `Buffer`, how to build paths that survive a different working directory, how to read and write JSON and CSV, and how to do all of it without losing data when something fails halfway.

The one rule that saves the most points: decide early whether the file fits in memory. Under a few megabytes, read it whole. Above that, stream it, and the streams page takes over from there.

## Simplest form

```js
// ESM. Data shape: readFile resolves to a Buffer, or to a string when an encoding is passed.
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('notes.txt', 'utf8');      // 'first line\nsecond line\n'
await writeFile('notes-copy.txt', text + 'third line\n'); // creates or truncates the file
```

The CommonJS shape of the same two calls, when the project is not on ESM yet:

```js
// Data shape: same string in, same file out. require('node:fs') has no .promises shortcut chained.
const { readFile, writeFile } = require('node:fs/promises');

readFile('notes.txt', 'utf8').then((text) => writeFile('notes-copy.txt', text));
```

## What it does

`readFile` opens the path, reads until end of file, closes the handle, and hands you the whole content as one value. `writeFile` opens the path with the `w` flag, which creates the file when missing and truncates it when present, writes the value, and closes.

Both are asynchronous. The promise versions return a promise, the callback versions take an error-first callback, and the `*Sync` versions block the thread until the disk answers. Same underlying system calls, three different shapes.

That blocking detail matters in a server. A `readFileSync` inside an Express handler stops every other request for the duration of the disk read, and on a slow or network-mounted disk that is visible as a stall. In a one-shot script that runs and exits, sync is fine and often shorter.

## Every part

### The three faces of the same call

```js
import { readFile, readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

// 1. Promise. Use in async code, servers, anything with await nearby.
const a = await readFileAsync('data.txt', 'utf8');

// 2. Callback. Older code and APIs that still hand you callbacks.
readFile('data.txt', 'utf8', (err, text) => {
    if (err) throw err;
    console.log(text.length);
});

// 3. Sync. Scripts, startup config, tests. Blocks the event loop.
const c = readFileSync('data.txt', 'utf8');
```

Pick one family per file and stay in it. Mixing them in one function is where half-finished error handling comes from.

The import specifier matters. `require('fs')` and `import fs from 'node:fs'` both work, but the `node:` prefix marks it as a builtin and cannot be shadowed by a package named `fs` in `node_modules`. Use the prefix in new code.

`node:fs/promises` exports the promise versions directly. The older route, `fs.promises.readFile`, reaches the same functions through a property, which is fine but longer. Both accept the same arguments.

### Encoding decides the type

Without an encoding you get a `Buffer`, a raw byte array with methods such as `toString`, `subarray` and `equals`. With `'utf8'` you get a JavaScript string.

```js
import { readFile } from 'node:fs/promises';

const bytes = await readFile('logo.bin');        // Buffer, length in bytes
const text = await readFile('notes.txt', 'utf8'); // string, length in UTF-16 code units
console.log(bytes.length, text.length);           // 4021 3980, they are not comparable
```

`writeFile` mirrors this. Pass a string and it is encoded as UTF-8 by default. Pass a `Buffer` and the bytes are written untouched. Pass anything else, such as a number or a plain object, and it throws `TypeError [ERR_INVALID_ARG_TYPE]`. Serialize first: `JSON.stringify`, `String`, or `Buffer.from`.

Encoding names are the ones the platform understands: `utf8`, `utf16le`, `latin1`, `base64`, `hex`, `ascii`. For text files produced on Windows, `latin1` sometimes shows up, but UTF-8 is the safe default and the only one worth remembering for the exam.

A subtle one: a UTF-8 file that starts with a byte order mark reads as a string beginning with `\uFEFF`. `JSON.parse` rejects that, so strip it when a file came from Excel: `text.replace(/^\uFEFF/, '')`.

### Paths that do not depend on where you started

`process.cwd()` is the directory the process was started from, not the directory of the source file. `npm start` from the project root and `node src/index.js` from `src` give different answers for a relative path like `'data/input.csv'`.

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM has no __dirname. Build it once at the top of the module.
const here = path.dirname(fileURLToPath(import.meta.url));

// Absolute path anchored to the source file, not to the shell.
const inputPath = path.join(here, '..', 'data', 'bookings.csv');
```

`path.join` glues segments and normalizes separators. `path.resolve` starts from the rightmost absolute segment, or from `process.cwd()` when there is none, and returns an absolute path. `path.dirname`, `path.basename` and `path.extname` split a path without touching the disk.

In CommonJS, `__dirname` is already available and `path.join(__dirname, 'data', 'bookings.csv')` is enough. Do not build paths with `'folder' + '/' + 'file'`, because the separator on Windows is `\` and doubled slashes appear from time to time.

### Append instead of overwrite

`writeFile` replaces the whole file. `appendFile` opens with the `a` flag, creates the file when missing, and writes at the end.

```js
import { appendFile } from 'node:fs/promises';

// Data shape: one line per event, newline included by the caller.
await appendFile('run.log', `${new Date().toISOString()} started\n`);
```

The newline is your job. Without it, the log becomes one long line, and the next person who reads it with `readline` gets a single record.

`writeFile` also accepts a flag option, which is how you get append or exclusive-create without switching function:

```js
// 'a' appends, 'wx' fails with EEXIST instead of overwriting an existing file.
await writeFile('out.csv', header, { flag: 'a' });
await writeFile('report.json', body, { flag: 'wx' }); // throws when the file exists
```

The `wx` flag is the cheapest guard against a script that silently overwrites yesterday's result.

### Directories and metadata

A write into a missing directory fails with `ENOENT`. Create the tree first, with `recursive: true` so an existing directory is not an error:

```js
import { mkdir, readdir, stat } from 'node:fs/promises';

await mkdir('out/reports', { recursive: true });

const entries = await readdir('data', { withFileTypes: true }); // Dirent objects, not strings
for (const entry of entries) {
    if (!entry.isFile()) continue;
    const info = await stat(`data/${entry.name}`);
    console.log(entry.name, info.size, info.mtime.toISOString());
}
```

`Dirent.isFile()` and `isDirectory()` come from the directory listing itself and cost nothing extra. Calling `stat` on every entry costs one system call each, so only do it when you need size or time.

`stat` follows symbolic links, `lstat` does not. `stats.size` is in bytes, `stats.mtime` is a `Date`. `isDirectory()` on the result tells you whether a path is a folder without trying to read it.

To remove, `rm` replaces the deprecated `unlink` for most cases:

```js
import { rm } from 'node:fs/promises';

await rm('out/tmp', { recursive: true, force: true }); // no throw when it is already gone
```

`force: true` swallows `ENOENT`. Without it, deleting a file that is not there is an error, which is correct in a cleanup step only half of the time.

### Errors are values with a code

Every filesystem failure rejects with an `Error` that has a `code` property. Match on `code`, not on the message text, because the message includes the path and the locale may change.

```js
import { readFile } from 'node:fs/promises';

try {
    const text = await readFile('settings.json', 'utf8');
} catch (err) {
    if (err.code === 'ENOENT') {
        // File is absent. That is a normal state, not a crash.
    } else if (err.code === 'EACCES') {
        // Permission denied. The process cannot do anything about it.
    } else {
        throw err; // Unknown problem. Do not hide it.
    }
}
```

The codes worth knowing: `ENOENT` (no such file or directory), `EACCES` (permission denied), `EISDIR` (you tried to read a directory as a file), `ENOTDIR` (a path segment is a file), `EEXIST` (with the `wx` flag), `ENOSPC` (disk full), `EMFILE` (too many open handles), `EXDEV` (rename across filesystems).

A `SyntaxError` from `JSON.parse` has no `code`. Separate parsing from reading so the catch blocks do not have to guess which layer failed.

### Write whole, then rename

A crash in the middle of `writeFile` leaves a truncated file, and the old content is already gone. For a report or a settings file that another process reads, write a temporary file in the same directory and rename it over the target. Rename within one filesystem is atomic.

```js
import { writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';

async function writeAtomic(target, data) {
    const tmp = path.join(path.dirname(target), `.${path.basename(target)}.${process.pid}.tmp`);
    try {
        await writeFile(tmp, data);
        await rename(tmp, target); // the old file is replaced in one step
    } catch (err) {
        await rm(tmp, { force: true }); // do not leave debris behind
        throw err;
    }
}
```

The temporary file must sit in the same directory. `/tmp` is often a different filesystem, and `rename` across devices fails with `EXDEV`.

### JSON

There is no `readJson`. Read the text, then parse it.

```js
import { readFile, writeFile } from 'node:fs/promises';

// Data shape: object in memory, pretty printed text on disk.
const raw = await readFile('config.json', 'utf8');
const config = JSON.parse(raw);

config.port = 3000;
await writeFile('config.json', JSON.stringify(config, null, 2) + '\n');
```

`JSON.stringify(value, null, 2)` produces readable output, and the trailing newline keeps `git diff` from complaining about a missing final line. Without a replacer or spacing, the file is one long line, which is fine for machine output and painful in a diff.

Defaults belong in code, not in the file, so a missing key does not crash the program:

```js
const config = { port: 3000, host: 'localhost', ...JSON.parse(raw) };
```

Reading a settings file at startup with `readFileSync` is acceptable and shorter. The blocking happens once, before the server listens.

### CSV without a dependency

For the exam, a CSV is a header line and comma separated rows. Split on `\n`, then on `,`.

```js
const text = await readFile('bookings.csv', 'utf8');
const [headerLine, ...lines] = text.trim().split(/\r?\n/);
const columns = headerLine.split(',');

const rows = lines.map((line) => {
    const cells = line.split(',');
    return Object.fromEntries(columns.map((name, index) => [name, cells[index]]));
});
// Data shape: [{ booking_id: '1', customer_email: 'a@b.c', ... }, ...]
```

This breaks when a value contains a comma inside quotes, for example `"Smith, Anna"`. If the data can contain that, write a small state machine that walks characters and tracks whether it is inside quotes, or keep the field free of commas and say so in a comment. Do not pretend the naive split is a full parser.

Numbers arrive as strings. Convert with `Number(cells[3])` at the point of use, and check `Number.isFinite` before trusting the result.

Writing CSV is the reverse, and quoting is again the caller's job:

```js
const escapeCell = (value) => {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const lines = rows.map((row) => columns.map((name) => escapeCell(row[name])).join(','));
await writeFile('out.csv', lines.join('\n') + '\n');
```

### Line by line with readline

`readline` turns a readable stream into an async iterator of lines, which is the right tool when the file is mostly text and you care about records, not bytes.

```js
import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: createReadStream('big.log', 'utf8'),
    crlfDelay: Infinity, // treat \r\n as one line break on every platform
});

let errors = 0;
for await (const line of rl) {
    if (line.includes(' ERROR ')) errors += 1;
}
console.log({ errors });
```

`crlfDelay: Infinity` is the flag that stops Windows files from leaving a stray `\r` at the end of every line. Without it, a comparison against `'ERROR'` can fail for reasons that look impossible.

The interface closes the stream when the loop ends or `break` runs, so no manual `close` is needed. Memory stays flat because only one line is alive at a time.

### When the file is too big

`readFile` loads the whole file, so a 2 GB log file becomes a 2 GB string plus the buffer it was decoded from. `createReadStream` hands you chunks and never holds more than a few of them. `pipeline` moves those chunks into a writable with backpressure handled for you.

The streams page covers that in full. The short version:

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

await pipeline(createReadStream('input.log'), createWriteStream('output.log'));
```

## Examples

### Example 1: a settings file with defaults

```js
// settings.js. Read a JSON config, fill missing keys, write it back atomically.
import { readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(here, 'config.json');

// Data shape on disk: { "port": 3000, "host": "localhost", "debug": false }
const defaults = { port: 3000, host: 'localhost', debug: false };

async function loadConfig() {
    try {
        const raw = await readFile(file, 'utf8');
        return { ...defaults, ...JSON.parse(raw) };
    } catch (err) {
        if (err.code === 'ENOENT') return { ...defaults }; // first run
        if (err instanceof SyntaxError) {
            throw new Error(`config.json is not valid JSON: ${err.message}`);
        }
        throw err;
    }
}

async function saveConfig(config) {
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(config, null, 2) + '\n');
    try {
        await rename(tmp, file);
    } catch (err) {
        await rm(tmp, { force: true });
        throw err;
    }
}

const config = await loadConfig();
config.debug = true;
await saveConfig(config);
console.log(config); // { port: 3000, host: 'localhost', debug: true }
```

### Example 2: an append-only audit log

```js
// audit.js. One JSON object per line, appended, never rewritten.
import { appendFile } from 'node:fs/promises';

// Data shape: one line per event, each line a complete JSON object.
async function audit(event, details) {
    const record = { at: new Date().toISOString(), event, ...details };
    // The newline is added here and nowhere else, so every line stays parseable.
    await appendFile('audit.log', JSON.stringify(record) + '\n');
}

await audit('login', { customer_email: 'student@example.com' });
await audit('booking_created', { booking_id: 17, hotel_id: 3 });
```

Reading it back is a `readline` loop, and a line that fails to parse can be skipped and counted instead of killing the run.

### Example 3: total the size of a folder tree

```js
// size.js. Walk a directory, sum file sizes, print the largest files.
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

// Data shape: { files: 12, bytes: 480211, largest: [{ path, size }, ...] }
async function walk(dir, acc = { files: 0, bytes: 0, largest: [] }) {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(full, acc); // recurse, same accumulator
        } else if (entry.isFile()) {
            const info = await stat(full);
            acc.files += 1;
            acc.bytes += info.size;
            acc.largest.push({ path: full, size: info.size });
        }
    }

    return acc;
}

const result = await walk('.');
result.largest.sort((a, b) => b.size - a.size);
console.log({ files: result.files, bytes: result.bytes });
console.log(result.largest.slice(0, 5));
```

Skip `node_modules` and `.git` in a real run, or the numbers describe dependencies instead of your work.

### Example 4: CSV in, validated JSON report out

This is the shape of the file-processing task. It reads a bookings CSV, checks every row, groups by hotel, writes a JSON report and a CSV summary, logs a line, and never leaves a half-written report on disk.

```js
// report.js. Run with: node report.js data/bookings.csv out/report.json
import { readFile, writeFile, appendFile, mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';

const inputPath = process.argv[2] ?? 'data/bookings.csv';
const outputPath = process.argv[3] ?? 'out/report.json';

// Read the whole file. A bookings CSV for an exam is small; a multi-gigabyte
// file would need createReadStream and readline here instead.
async function readCsv(file) {
    const text = (await readFile(file, 'utf8')).replace(/^\uFEFF/, '');
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
    if (lines.length === 0) throw new Error(`${file} is empty`);

    const columns = lines[0].split(',').map((name) => name.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i += 1) {
        const cells = lines[i].split(',');
        // A short row means a trailing comma or a broken export. Report it,
        // do not let undefined travel through the rest of the program.
        if (cells.length !== columns.length) {
            throw new Error(`line ${i + 1}: expected ${columns.length} cells, got ${cells.length}`);
        }
        const row = Object.fromEntries(columns.map((name, index) => [name, cells[index].trim()]));
        row.line = i + 1; // keep the source line for error messages
        rows.push(row);
    }

    return { columns, rows };
}

// Validation returns a list of problems instead of throwing on the first one,
// so one bad row does not hide the next twenty.
function validate(row) {
    const problems = [];
    if (!row.customer_email?.includes('@')) problems.push('customer_email');
    if (!Number.isInteger(Number(row.hotel_id))) problems.push('hotel_id');
    if (!Number.isInteger(Number(row.adults)) || Number(row.adults) < 1) problems.push('adults');
    if (Number.isNaN(Date.parse(row.start_date))) problems.push('start_date');
    if (Number.isNaN(Date.parse(row.end_date))) problems.push('end_date');
    if (Date.parse(row.end_date) < Date.parse(row.start_date)) problems.push('date_order');
    return problems;
}

function nights(row) {
    const ms = Date.parse(row.end_date) - Date.parse(row.start_date);
    return Math.max(1, Math.round(ms / 86_400_000));
}

// Atomic write: the report either appears complete or does not appear at all.
async function writeAtomic(target, data) {
    await mkdir(path.dirname(target), { recursive: true });
    const tmp = path.join(path.dirname(target), `.${path.basename(target)}.${process.pid}.tmp`);
    try {
        await writeFile(tmp, data);
        await rename(tmp, target);
    } catch (err) {
        await rm(tmp, { force: true });
        throw err;
    }
}

async function main() {
    const { rows } = await readCsv(inputPath);

    const hotels = new Map(); // hotel_id -> { hotel_id, bookings, guests, nights }
    const rejected = [];

    for (const row of rows) {
        const problems = validate(row);
        if (problems.length > 0) {
            rejected.push({ line: row.line, problems });
            continue; // keep going, the report lists every bad row
        }

        const key = Number(row.hotel_id);
        const bucket = hotels.get(key) ?? { hotel_id: key, bookings: 0, guests: 0, nights: 0 };
        bucket.bookings += 1;
        bucket.guests += Number(row.adults) + Number(row.children ?? 0);
        bucket.nights += nights(row);
        hotels.set(key, bucket);
    }

    const report = {
        source: inputPath,
        generated_at: new Date().toISOString(),
        total_rows: rows.length,
        accepted: rows.length - rejected.length,
        rejected,
        hotels: [...hotels.values()].sort((a, b) => a.hotel_id - b.hotel_id),
    };

    await writeAtomic(outputPath, JSON.stringify(report, null, 2) + '\n');

    // A separate summary file, written next to the log, not inside it.
    const summary = [
        'hotel_id,bookings,guests,nights',
        ...report.hotels.map((h) => `${h.hotel_id},${h.bookings},${h.guests},${h.nights}`),
    ].join('\n');
    await writeAtomic(path.join(path.dirname(outputPath), 'summary.csv'), summary + '\n');

    await appendFile('out/run.log', `${report.generated_at} ${inputPath} ${report.accepted}/${report.total_rows}\n`);
    console.log(`wrote ${outputPath}: ${report.accepted} accepted, ${rejected.length} rejected`);
}

main().catch((err) => {
    // One place prints the failure and one place sets the exit code.
    console.error(`report failed: ${err.code ?? ''} ${err.message}`.trim());
    process.exitCode = 1;
});
```

The `line` field and the rejected list are what turn a failing script into a fixable one. Without them the output is a wrong number with no address.

## Common mistakes

- Reading without `'utf8'` and then comparing the `Buffer` to a string. `bytes === 'text'` is always false, and `bytes.includes('text')` throws. Add the encoding, or call `.toString('utf8')` once.
- Building a path from `process.cwd()` when the file sits beside the source. The answer changes with the directory you launched from. Anchor with `fileURLToPath(import.meta.url)` or `__dirname`.
- Forgetting `mkdir(..., { recursive: true })` before a write, then reading `ENOENT` as "the input file is missing" when the output directory was the missing part.
- Using `writeFile` to add a line and losing the previous content. Append is `appendFile`, or the `a` flag.
- Catching every error from a `try` block and treating it as "file not found". Check `err.code` and rethrow what you do not understand.
- Calling `JSON.parse` on a file that starts with a byte order mark. Strip `\uFEFF` first.
- Writing a report in place with `writeFile` while another process reads it. Write a temp file and rename.
- `readFile` on a directory: the code is `EISDIR` on Linux, and the message reads like a path typo. List it with `readdir` instead.
- A `for` loop over `readdir` results that calls `stat` on names starting with a dot and then wonders why the totals include `.git`. Filter, or use `withFileTypes`.
- Splitting CSV on commas and assuming quoted commas do not exist. Either handle quotes or state the limit in a comment.
- Leaving the process alive after a partial read because a stream was never closed. With `readline` and `pipeline` this is handled, with manual `data` listeners it is not.

## Exam checklist

- `readFile` with `'utf8'` returns a string, without it a `Buffer`. Know which one you have before calling string methods.
- Write one example each of the promise, callback and sync form, and say why a server avoids the sync one.
- `readFile` plus `JSON.parse`, and `JSON.stringify(value, null, 2)` plus `writeFile`, both written from memory.
- Error handling matches `err.code === 'ENOENT'` and rethrows the rest.
- A path is built with `path.join` from `fileURLToPath(import.meta.url)` (ESM) or `__dirname` (CJS).
- `mkdir(dir, { recursive: true })` runs before a write into a fresh folder.
- `appendFile` is used for logs, and the newline is included in the written string.
- `readdir(dir, { withFileTypes: true })` and `entry.isFile()` used to tell files from folders.
- `stat` reports `size` in bytes and `mtime` as a `Date`, and it follows symlinks while `lstat` does not.
- A CSV read splits lines on `/\r?\n/`, maps the header to cells, converts numbers with `Number`, and notes the quoting limit.
- A large file switches to `createReadStream` with `pipeline` or `readline`, and the reason is memory, not speed.
- A report meant for another process is written to a temp file in the same directory and renamed into place.
- The final script prints a short summary and sets `process.exitCode = 1` on failure instead of leaving a silent partial run.


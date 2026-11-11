# readFileSync()

Node.js command · Files

Reads a whole file and returns it directly, blocking until the disk answers. Fine in a startup script, wrong inside a request handler.

## Syntax

```js
const data = readFileSync(path, options?)
```

## Example

```js
import { readFileSync } from 'node:fs';

// Startup config: this runs once, before the server listens.
const raw = readFileSync('config.json', 'utf8');
const config = { port: 3000, ...JSON.parse(raw) };

console.log(config.port);

// A missing file throws, and the stack points at this line.
// try {
//     readFileSync('config.json', 'utf8');
// } catch (err) {
//     if (err.code !== 'ENOENT') throw err;
// }
```

## Details

Sync calls block the event loop, so every other request waits while the disk works. They are acceptable in scripts, tests and startup code, and a bad habit inside an Express handler.

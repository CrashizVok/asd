# appendFile()

Node.js command · Files

Adds data at the end of a file and creates the file when it does not exist. The newline is the caller responsibility.

## Syntax

```js
await appendFile(path, data, options?)
```

## Example

```js
import { appendFile } from 'node:fs/promises';

// One JSON object per line keeps the log parseable later.
const event = { at: new Date().toISOString(), event: 'login', user: 17 };
await appendFile('audit.log', JSON.stringify(event) + '\n');

// Plain text lines, newline included explicitly.
await appendFile('run.log', `${new Date().toISOString()} started\n`);
```

## Details

`appendFile` uses the `a` flag, which writes at the end even when other processes append at the same time. Without the trailing `\n` the log becomes one very long line and every line reader sees a single record.

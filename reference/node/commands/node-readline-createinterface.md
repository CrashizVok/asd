# readline.createInterface()

Node.js command · Line reading

Turns a readable stream into an async iterator of lines without loading the file into memory. Handles lines split across chunks.

## Syntax

```js
readline.createInterface({ input, crlfDelay: Infinity })
```

## Example

```js
import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: createReadStream('access.log', 'utf8'),
    crlfDelay: Infinity, // treat \r\n as one break on every platform
});

let errors = 0;
for await (const line of rl) {
    if (line.includes(' 500 ')) errors += 1;
}
console.log({ errors });
```

## Details

`crlfDelay: Infinity` stops a Windows file from leaving `\r` at the end of every line. Breaking out of the loop closes the interface and destroys the stream, so no manual cleanup is needed.

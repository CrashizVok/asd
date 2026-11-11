# path.resolve()

Node.js command · Paths

Builds an absolute path, starting from the rightmost absolute segment or from process.cwd().

## Syntax

```js
path.resolve(...segments)
```

## Example

```js
import path from 'node:path';

// Anchored to the current working directory.
console.log(path.resolve('data', 'bookings.csv'));
// /home/student/project/data/bookings.csv

// An absolute segment resets the chain.
console.log(path.resolve('/srv/app', 'data', 'bookings.csv'));
// /srv/app/data/bookings.csv
```

## Details

Use `resolve` when the result must be absolute, for example before comparing paths or passing one to another process. It depends on where the process was started, so it is a poor choice for a file that sits beside the source; use `join` with `__dirname` or the module URL there.

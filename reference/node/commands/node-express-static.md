# express.static()

Node.js command · Middleware

Serves files from a directory over GET and HEAD. A missing file calls next() instead of answering.

## Syntax

```js
app.use(express.static(root, [options]))
```

## Example

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

// public/logo.png answers GET /logo.png
app.use(express.static(path.join(here, 'public'), {
    maxAge: '1h',
    index: 'index.html',
}));

// Mount a second folder under a prefix: GET /uploads/a.jpg
app.use('/uploads', express.static(path.join(here, 'uploads')));
```

## Details

The path must be absolute or resolved from the working directory. `path.join(__dirname, ...)` in CommonJS, `fileURLToPath(import.meta.url)` in ESM.

It refuses `..` segments, so it cannot be used to read outside the folder. It also does not list directories.

Register it before the 404 handler, otherwise the 404 wins. Static files bypass the body parsers in cost only; the order rule is about who answers first, not about performance.

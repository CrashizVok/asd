# dotenv/config

Node.js command · Environment

Loads .env into process.env at import time. Existing shell variables win, and every value arrives as a string.

## Syntax

```js
import 'dotenv/config';
```

## Example

```js
// server.js, first import of the file, before anything reads process.env.
import 'dotenv/config';
import express from 'express';

const port = Number(process.env.PORT) || 3000;
const app = express();

app.get('/api/health', (request, response) => {
  // Show which database the process will use, never the password.
  response.json({ ok: true, db: process.env.DB_NAME });
});

app.listen(port, () => console.log(`http://localhost:${port}`));
```

## Details

The import must come before any module that reads the environment while loading, such as a connection pool created at import time. A pool built before dotenv runs sees `undefined` and falls back to defaults, which looks like a database outage.

For options use the function form: `dotenv.config({ path: '.env.local', override: true })`. `override` makes the file win over the shell.

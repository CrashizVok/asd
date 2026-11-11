# cors()

Node.js command · Security

Lets a browser page from another origin read the API response. It is not authentication and does not stop curl.

## Syntax

```js
app.use(cors({ origin: 'http://localhost:5173' }))
```

## Example

```js
import express from 'express';
import cors from 'cors';

const app = express();

// The React dev server runs on 5173, the API on 3000.
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));

// Open to every origin. Fine for a local exam, too broad for a real server.
// app.use(cors());

app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (request, response) => response.json({ ok: true }));
app.listen(3000);
```

## Details

The browser blocks a cross origin read unless the response carries `Access-Control-Allow-Origin`. `cors()` adds that header, and the middleware must be registered before the routes so it runs on every request including errors.

Credentials change the setup: `cors({ origin: '...', credentials: true })` plus `fetch(url, { credentials: 'include' })` on the client. A wildcard origin cannot be combined with credentials.

# cors()

Node.js command · Security

Adds the Access-Control-Allow-Origin headers and answers the OPTIONS preflight. Needed when the React dev server calls the API from another port.

## Syntax

```js
app.use(cors([options]))
```

## Example

```js
import cors from 'cors';

// Open to every origin. Fine for the exam, not for a real login.
app.use(cors());

// Narrow it to the dev server.
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
}));
```

## Details

CORS is enforced by the browser, not the server. Curl and Postman ignore it, so a request that works there can still fail in the page.

A JSON `POST` triggers a preflight `OPTIONS` request first. The middleware answers it before your routes, which is why it belongs near the top of the file.

A wildcard origin and credentials cannot be combined. `{ origin: true, credentials: true }` reflects the caller's origin and works with cookies; `'*'` does not.

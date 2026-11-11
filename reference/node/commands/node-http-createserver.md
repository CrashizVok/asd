# http.createServer()

Node.js command · Setup

The Node built in server. Express wraps it, so knowing this form explains what app.listen does and what req and res really are.

## Syntax

```js
http.createServer((request, response) => { ... })
```

## Example

```js
import { createServer } from 'node:http';

const server = createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/api/health') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ ok: true }));
        return;
    }

    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000);
```

## Details

Without a framework every route is another branch, `request.url` still carries the query string, and the body arrives as a readable stream.

Express replaces the branch with a routing list and adds `res.json`, `res.status` and body parsers. The underlying objects stay the same, which is why `response.end()` and `response.writeHead()` still work inside an Express handler.

One practical difference: in plain `http` an unhandled exception kills the process. Express routes it to an error handler if you registered one.

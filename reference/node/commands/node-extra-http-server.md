# http.createServer

Node.js command · HTTP

The built in HTTP server behind Express. It handles every request with one callback and leaves routing to you.

## Syntax

```js
createServer((req, res) => { ... }).listen(port)
```

## Example

```js
// File: server.js
import { createServer } from "node:http";

const server = createServer((req, res) => {
  // req.url includes the query string
  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Every response must end, otherwise the client waits
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});

// POST bodies arrive as a stream, collect them with for await (const chunk of req)
```

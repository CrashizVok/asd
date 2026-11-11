# Custom middleware

Node.js command · Express

Runs before the route handlers. Call next to continue, send a response to stop, and never do both.

## Syntax

```js
app.use((req, res, next) => { ... })
```

## Example

```js
// File: app.js
import express from "express";

const app = express();

// Logs every request with its method, url, and duration
app.use((req, res, next) => {
  const started = Date.now();

  res.on("finish", () => {
    console.log(req.method, req.originalUrl, res.statusCode, Date.now() - started + "ms");
  });

  next(); // without this the request hangs
});

// A middleware can also stop the chain
app.use("/admin", (req, res, next) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
});

app.get("/api/hotels", (req, res) => res.json([]));
```

# express.json

Node.js command · Express

Parses JSON request bodies into req.body. Without it req.body stays undefined and every POST handler breaks.

## Syntax

```js
app.use(express.json())
```

## Example

```js
// File: app.js
import express from "express";

const app = express();

// The parser runs before the routes, a limit protects memory
app.use(express.json({ limit: "100kb" }));

// Form posts use express.urlencoded instead
app.use(express.urlencoded({ extended: true }));

app.post("/api/hotels", (req, res) => {
  const { name, city, stars } = req.body;

  if (!name || !city) {
    return res.status(400).json({ error: "name and city are required" });
  }

  // Malformed JSON is rejected by the parser with a 400 before this runs
  res.status(201).json({ name, city, stars: Number(stars) });
});
```

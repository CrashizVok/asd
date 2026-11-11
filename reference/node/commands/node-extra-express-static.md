# express.static

Node.js command · Express

Serves files from a folder without a route per file. The mount path is optional and defaults to the site root.

## Syntax

```js
app.use('/assets', express.static('public'))
```

## Example

```js
// File: app.js
import express from "express";
import path from "node:path";

const app = express();

// /assets/logo.png maps to public/logo.png
app.use("/assets", express.static(path.join(process.cwd(), "public")));

// Options matter for caching and dotfiles
app.use(
  "/uploads",
  express.static("uploads", {
    maxAge: "1d",
    dotfiles: "ignore",
    index: false
  })
);

// A file that does not exist falls through to the next middleware
app.use((req, res) => res.status(404).json({ error: "not found" }));
```

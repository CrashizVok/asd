# process.env

Node.js command · Process

Reads environment variables as strings. A missing variable is undefined, so validate the ones the app cannot run without.

## Syntax

```js
process.env.NAME
```

## Example

```js
// File: src/db.js
// Start with: DATABASE_URL=mysql://user:pass@localhost/app node src/db.js
import knex from "knex";

const connection = process.env.DATABASE_URL;

if (!connection) {
  // Fail fast instead of connecting to nothing
  throw new Error("DATABASE_URL is not set");
}

export const db = knex({ client: "mysql2", connection });

// Every value is a string, numbers need parsing
const port = Number(process.env.PORT || 3000);
console.log(port);
```

# knex()

Node.js command · Setup

Creates a query builder factory with its own connection pool. Call it once per process, in a module you import everywhere.

## Syntax

```js
const db = knex(config)
```

## Example

```js
// db.js
import 'dotenv/config';
import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'bookings',
  },
});

export default db;

// Lazy: no socket is opened until the first query runs.
```

## Details

A `knex()` call per request is the classic bug. Each call builds another pool, MySQL counts the connections, and the error is `ER_CON_COUNT_ERROR: Too many connections`.

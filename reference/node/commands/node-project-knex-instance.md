# knex(config)

Node.js command · Setup

Creates one query builder with a connection pool. Call it once per process and export the result, because each call opens another pool.

## Syntax

```js
knex({ client: 'mysql2', connection, pool })
```

## Example

```js
import knex from 'knex';
import 'dotenv/config';

// One instance for the whole app. Routers import this object.
export const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'bookings',
        // DATE columns stay as "2026-07-01" strings.
        dateStrings: true,
    },
    pool: { min: 0, max: 10 },
});
```

## Details

Knex wraps the mysql2 driver, so awaiting a query builder works without a callback. Keep the pool small. Ten connections per app instance is enough for an exam and leaves room for other clients.

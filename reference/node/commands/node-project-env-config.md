# Connection from environment

Node.js command · Setup

Reads connection settings from .env with a local default, so the same code runs on a laptop and in a container. The password never sits in the repository.

## Syntax

```js
process.env.DB_HOST || "127.0.0.1"
```

## Example

```js
// .env, not committed
// DB_HOST=127.0.0.1
// DB_PORT=3306
// DB_USER=root
// DB_PASSWORD=
// DB_NAME=bookings
// PORT=3000

// db.js
import 'dotenv/config';
import knex from 'knex';

export const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'bookings',
        dateStrings: true,
    },
});

// server.js
const port = Number(process.env.PORT) || 3000;
```

## Details

`import 'dotenv/config'` must run before the object is built, so it goes at the top of the file that creates the pool. Adding the import to server.js only works if server.js loads db.js afterwards.

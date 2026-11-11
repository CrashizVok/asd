# install knex with mysql2

Node.js command · Setup

Knex has no driver of its own. mysql2 is the package that opens MySQL sockets, so both go into dependencies.

## Syntax

```js
npm install knex mysql2
```

## Example

```js
// package.json after: npm install knex mysql2
// knex 3.x works with mysql2 3.x. Do not also install the old "mysql".
{
  "type": "module",
  "dependencies": {
    "knex": "^3.1.0",
    "mysql2": "^3.12.0"
  }
}

// A missing driver shows up on the first query, not at import time:
// Knex: run $ npm install mysql2
import knex from 'knex';
const db = knex({ client: 'mysql2', connection: { database: 'bookings' } });
await db.raw('select 1');
await db.destroy();
```

## Details

The `client` value does two jobs: it picks the SQL dialect and it names the driver module. `mysql2` is the maintained driver. `mysql` is the old one and differs on big integers and decimals.

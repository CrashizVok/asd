# knexfile

Node.js command · Setup

Configuration file the knex CLI and the app share. Keyed by environment, so credentials stay out of code.

## Syntax

```js
module.exports = { development: {...}, production: {...} }
```

## Example

```js
// knexfile.cjs
// .cjs on purpose: the CLI loads this file with require, and a
// package.json with "type": "module" makes a plain .js file an ES module.
require('dotenv/config');

const base = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'bookings',
  },
  dateStrings: true,
  migrations: { directory: './db/migrations', tableName: 'knex_migrations' },
  seeds: { directory: './db/seeds' },
};

module.exports = {
  development: { ...base, pool: { min: 0, max: 10 } },
  production: { ...base, pool: { min: 2, max: 20 }, asyncStackTraces: false },
};
```

## Details

Older examples put `dateStrings` at the top level. It belongs in `connection`, because mysql2 reads it. Pick the block with `config[process.env.NODE_ENV ?? 'development']`, and give the CLI the same file: `npx knex migrate:latest --knexfile knexfile.cjs --env production`.

# migrate:latest

Node.js command · Migrations

Runs every migration that is not in the `knex_migrations` table yet. Rollback undoes the last batch.

## Syntax

```js
npx knex migrate:latest --knexfile knexfile.cjs
```

## Example

```js
// Create a file, then fill in exports.up and exports.down.
// npx knex migrate:make create_booking_tables --knexfile knexfile.cjs

// Apply everything pending.
// npx knex migrate:latest --knexfile knexfile.cjs

// Undo the last batch. Each migrate:latest run is one batch,
// so this can undo several files at once.
// npx knex migrate:rollback --knexfile knexfile.cjs

// What is applied and what is pending.
// npx knex migrate:list --knexfile knexfile.cjs

// From application code, for a test database.
await db.migrate.latest();
await db.migrate.rollback();
```

## Details

The bookkeeping table is `knex_migrations` by default. Give each app its own `tableName` when two apps share a database, or one app will skip the other's files.

# Knex with MySQL

Node.js topic · Exam Wiki

## Simplest form

```js
// Data shape: db('table') returns a builder; awaiting it gives an array of row objects
// Terminal output: [{ id: 1, name: 'Danube View', city: 'Budapest' }, ...]
import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bookings',
  },
});

const hotels = await db('hotels').select('id', 'name', 'city').limit(5);
console.log(hotels);

await db.destroy();
```

## What it does

Knex builds a SQL string and a separate list of bound values, then hands both to mysql2. The value list travels outside the SQL text, so an apostrophe inside a hotel name cannot end the statement early. That is the whole safety story, and it is the reason you never paste user input into a `raw` string.

The builder is lazy. `db('hotels')` only records intent. Nothing reaches the server until you `await` the builder, call `.then()`, or execute it through `first()`, `insert()`, and friends. Laziness is what lets a helper accept a half-built query, add a `where`, and return it.

`client: 'mysql2'` chooses two things at once: the SQL dialect (backticks around identifiers, `LIMIT n, m` pagination, no `RETURNING` clause) and the driver that opens the sockets. Knex contains no MySQL wire protocol of its own, which is why `mysql2` must be installed next to it.

One knex instance owns one connection pool. Create it once per process in a single module, import that module everywhere, and destroy it when the process ends.

## Install

```js
// package.json after: npm install knex mysql2
// knex 3.x pairs with mysql2 3.x. Do not add the older "mysql" package.
// dotenv is optional and only needed to read a local .env file.
{
  "type": "module",
  "dependencies": {
    "dotenv": "^16.4.7",
    "knex": "^3.1.0",
    "mysql2": "^3.12.0"
  }
}
```

If you skip `mysql2`, the first query fails with `Knex: run $ npm install mysql2`. That message is the install check, not a configuration bug.

## The knexfile

The knex CLI (`migrate:latest`, `seed:run`) reads a config file. Application code can import the same file, so the CLI and the server never disagree about the database.

```js
// knexfile.cjs
// CommonJS on purpose: the knex CLI loads this file with require, and a
// package.json with "type": "module" would make a plain .js file an ES module.
require('dotenv/config');

const base = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'bookings',
    // DATE columns arrive as 'YYYY-MM-DD' strings instead of Date objects,
    // so a date never shifts by a day through a timezone conversion.
    dateStrings: true,
  },
  pool: {
    min: 0,
    max: 10,
    acquireTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
  },
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
  asyncStackTraces: true,
};

module.exports = {
  development: { ...base, debug: false },
  production: {
    ...base,
    pool: { ...base.pool, min: 2, max: 20 },
    asyncStackTraces: false,
  },
};
```

Application code picks one environment and creates the pool:

```js
// db.js, the only file in the project that calls knex()
import 'dotenv/config';
import knex from 'knex';
import config from './knexfile.cjs';

const env = process.env.NODE_ENV ?? 'development';
const db = knex(config[env]);

export default db;
```

`process.env.NODE_ENV` decides which block runs. `npx knex migrate:latest --knexfile knexfile.cjs --env production` uses the same choice from the CLI side.

## Every part

- `client: 'mysql2'` sets the dialect and the driver. A wrong value such as `mysql` still connects but uses the old driver, which returns `BIGINT` and `DECIMAL` differently and loses the prepared statement path.
- `connection` is passed to mysql2 almost unchanged. Knex reads `host`, `port`, `user`, `password`, `database`; mysql2 understands the rest of the keys, including `dateStrings`, `charset`, `timezone`, `connectTimeout`, and `ssl`.
- `connection` can also be a function, which is how you fetch a rotating password from a secret store without caching it in the config object.
- `pool.min` is how many idle sockets stay open. `pool.max` is the hard cap for this process. Twenty app processes with `max: 10` ask MySQL for 200 connections, so compare the product against `max_connections`.
- `pool.acquireTimeoutMillis` makes a saturated pool fail with an error instead of queueing forever. `pool.idleTimeoutMillis` closes sockets that stayed unused, down to `min`.
- `pool.afterCreate(conn, done)` runs on every new socket. Use it for session settings such as `SET time_zone = '+00:00'` and call `done(err)` when the statement settles.
- `migrations.directory` and `seeds.directory` are resolved from the project root, not from the config file. `migrations.tableName` is the bookkeeping table; give each app its own name if two apps share a database.
- `asyncStackTraces: true` records the `await` that built the query, so a pool timeout points at your line instead of at knex internals. It costs a little memory per query.
- `debug: true` prints every statement with its bindings to the console. Never leave it on in production, because the bindings include personal data.
- `useNullAsDefault` appears in most tutorials. MySQL does not need it; only SQLite does. Leave it out.

## Pool behaviour

Nothing opens a socket at `knex()` time. The first query creates one connection, and the pool grows toward `max` as concurrent queries need sockets. A released socket goes back to the pool, not to the operating system.

`waitForConnections` is on by default, so a query that arrives when every socket is busy waits in a queue. That is usually what you want. The failure mode to watch is a slow query holding ten sockets while requests pile up behind it: every caller waits, then times out together.

Create knex once. A `knex()` call per request creates a new pool per request, MySQL refuses the connections after a while, and the error you see is `ER_CON_COUNT_ERROR: Too many connections`, which points at the server and hides the real cause in your code.

## Environment variables

Five names cover the exam setup: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`. Put them in `.env` as `KEY=value` lines with no spaces around the `=`, and keep that file out of git.

`import 'dotenv/config'` must run before the file that reads `process.env`. In ES modules imports are hoisted, so putting the dotenv import first in `db.js` is enough only because `knexfile.cjs` is loaded after it. If a value is still `undefined`, move the dotenv import to the entry point.

Give the application its own MySQL user with the rights it needs (`SELECT`, `INSERT`, `UPDATE`, `DELETE` on one database). The `root` account in a config file is a habit that survives into production.

## Examples

### Example 1: one module, one pool

```js
// db.js
import 'dotenv/config';
import knex from 'knex';
import config from './knexfile.cjs';

const db = knex(config[process.env.NODE_ENV ?? 'development']);

// Cheap liveness check for a health route. SELECT 1 touches the pool,
// so a broken socket shows up here before a real request fails.
export async function ping() {
  const [rows] = await db.raw('select 1 as ok');
  return rows[0].ok === 1;
}

export default db;
```

### Example 2: migration that creates the exam tables

```js
// db/migrations/20250101000000_create_booking_tables.cjs
// The migration is the schema in code form. Running it twice is safe: knex
// records finished files in knex_migrations and skips them.
exports.up = async function up(knex) {
  await knex.schema.createTable('customers', (table) => {
    table.string('email', 120).primary();
    table.string('first_name', 80).notNullable();
    table.string('last_name', 80).notNullable();
    table.string('phone', 40).nullable();
    table.date('birthday').nullable();
    table.string('image', 500).nullable();
    table.charset('utf8mb4');
    table.engine('InnoDB');
  });

  await knex.schema.createTable('hotels', (table) => {
    table.increments('id').primary();
    table.string('city', 80).notNullable();
    table.string('name', 120).notNullable();
    table.text('description').nullable();
    table.tinyint('stars').notNullable().defaultTo(0);
    table.string('owner_email', 120).notNullable();
    table.string('image', 500).nullable();
    // The foreign key and the check constraint live in the same table
    // builder as the columns they touch.
    table
      .foreign('owner_email')
      .references('email')
      .inTable('customers')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    table.check('stars between 0 and 5', [], 'chk_hotels_stars');
    table.charset('utf8mb4');
    table.engine('InnoDB');
  });

  await knex.schema.createTable('bookings', (table) => {
    table.string('customer_email', 120).notNullable();
    table.integer('hotel_id').unsigned().notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.tinyint('adults').unsigned().notNullable().defaultTo(1);
    table.tinyint('children').unsigned().notNullable().defaultTo(0);
    table.tinyint('boylovers').unsigned().notNullable().defaultTo(0);
    // No id column: the guest and the hotel identify the booking.
    table.primary(['customer_email', 'hotel_id']);
    table
      .foreign('customer_email')
      .references('email')
      .inTable('customers')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .foreign('hotel_id')
      .references('id')
      .inTable('hotels')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.charset('utf8mb4');
    table.engine('InnoDB');
  });
};

// down() is the undo. Drop in reverse order, because MySQL refuses to drop
// a table that another table still references.
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('bookings');
  await knex.schema.dropTableIfExists('hotels');
  await knex.schema.dropTableIfExists('customers');
};
```

### Example 3: seed with neutral rows

```js
// db/seeds/01_hotels.cjs
// Seeds are for local work. They delete before they insert, so nobody
// runs this against real data by accident.
exports.seed = async function seed(knex) {
  await knex('bookings').del();
  await knex('hotels').del();
  await knex('customers').del();

  await knex('customers').insert([
    {
      email: 'anna.kovacs@example.com',
      first_name: 'Anna',
      last_name: 'Kovacs',
      phone: '+36 30 111 1111',
      birthday: '1990-05-12',
      image: 'https://placehold.co/150x150/1d4ed8/ffffff?text=AK',
    },
    {
      email: 'ben.nagy@example.com',
      first_name: 'Ben',
      last_name: 'Nagy',
      phone: '+36 30 222 2222',
      birthday: '1985-11-03',
      image: 'https://placehold.co/150x150/0f766e/ffffff?text=BN',
    },
  ]);

  await knex('hotels').insert([
    {
      id: 1,
      city: 'Budapest',
      name: 'Danube View',
      description: 'A quiet hotel on the river with a breakfast room.',
      stars: 4,
      owner_email: 'anna.kovacs@example.com',
      image: 'https://placehold.co/800x500/0f172a/f8fafc?text=Danube+View',
    },
  ]);
};
```

### Example 4: a startup check that reports the real cause

```js
// scripts/check-db.js
// Run with: node scripts/check-db.js
import db from '../db.js';

// mysql2 reports the reason in err.code. A missing database and a bad
// password both look like "connection failed" until you read the code.
const MESSAGES = {
  ECONNREFUSED: 'MySQL is not listening on that host and port.',
  ER_ACCESS_DENIED_ERROR: 'Wrong user or password for this MySQL server.',
  ER_BAD_DB_ERROR: 'The database does not exist. Create it first.',
  ER_NO_SUCH_TABLE: 'Migrations have not run yet.',
};

async function main() {
  try {
    const [rows] = await db.raw('select version() as version');
    console.log('connected to MySQL', rows[0].version);

    const [{ total }] = await db('hotels').count('* as total');
    console.log('hotels in the database:', Number(total));
  } catch (error) {
    console.error(MESSAGES[error.code] ?? error.message);
    process.exitCode = 1;
  } finally {
    // Without destroy() the process keeps the pool open and never exits.
    await db.destroy();
  }
}

main();
```

### Example 5: graceful shutdown in a server

```js
// server.js
import express from 'express';
import db from './db.js';

const app = express();
app.use(express.json());

app.get('/api/health', async (req, res, next) => {
  try {
    await db.raw('select 1');
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

const server = app.listen(3000, () => {
  console.log('listening on 3000');
});

// Close the HTTP listener first, then the pool. In the other order a request
// still in flight borrows a socket that is already gone.
async function shutdown(signal) {
  console.log(`${signal} received, closing`);
  server.close(async () => {
    await db.destroy();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
```

## Common mistakes

- Calling `knex()` inside a route handler. Each call builds a new pool, and MySQL starts refusing connections.
- Leaving out `mysql2`. Knex installs cleanly without a driver and fails at the first query.
- Passing `password: undefined` because `.env` was not loaded. mysql2 then sends no password and MySQL answers `ER_ACCESS_DENIED_ERROR`.
- Importing dotenv after the config module. The values read as `undefined` and the fallbacks silently point at the wrong database.
- Writing `knexfile.js` with `export default` in a `"type": "module"` package and running the CLI. The CLI loads the file with `require`; use `.cjs`.
- Running migrations without `--knexfile` from a directory where the default `knexfile.js` does not exist.
- Setting `pool.max` to 50 "for speed". MySQL has a global connection limit and the app dies under load with `ER_CON_COUNT_ERROR`.
- Forgetting `await db.destroy()` in a script. The process hangs after printing its result.
- Assuming DATE columns are strings when `dateStrings` is off. A booking on the first of the month can render as the last day of the previous month.
- Storing the root password in the knexfile. It ends up in git history, and history is hard to rewrite.

## Exam checklist

- Can you name the two packages and say which one speaks to MySQL?
- Does your config choose the environment from `NODE_ENV` instead of hard-coding credentials?
- Is the knex instance created once and imported, or created per request?
- Would a wrong password produce a readable message instead of a stack trace dump?
- Does the pool have a maximum, and do you know how it interacts with `max_connections`?
- Are DATE values returned as `YYYY-MM-DD` strings, and can you justify `dateStrings`?
- Do migrations run in dependency order (customers, hotels, bookings) and drop in reverse?
- Does `down()` undo everything `up()` created?
- Does the seed delete child rows before parent rows?
- Does shutdown close the HTTP listener before the pool?


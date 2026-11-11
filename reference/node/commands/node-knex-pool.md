# pool

Node.js command · Setup

Bounds how many MySQL connections this process holds. Without a cap, load creates sockets until the server refuses them.

## Syntax

```js
pool: { min, max, acquireTimeoutMillis, idleTimeoutMillis, afterCreate }
```

## Example

```js
const db = knex({
  client: 'mysql2',
  connection: { host: 'localhost', database: 'bookings' },
  pool: {
    min: 0,                        // idle sockets kept open
    max: 10,                       // hard cap for this process
    acquireTimeoutMillis: 10_000,  // fail instead of queueing forever
    idleTimeoutMillis: 30_000,     // close a socket unused this long, down to min
    // Runs on every new socket. done(err) finishes the setup.
    afterCreate(conn, done) {
      conn.query("SET time_zone = '+00:00'", done);
    },
  },
});

// Ten app processes with max: 10 need 100 slots in MySQL max_connections.
```

## Details

`waitForConnections` is true by default, so queries queue when every socket is busy. One slow query holding all ten turns into a pile of waiters that time out together. Lower the pool or fix the query. Raising `max` only moves the failure into MySQL.

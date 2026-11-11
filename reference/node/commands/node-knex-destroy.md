# db.destroy()

Node.js command · Lifecycle

Closes every pooled socket. A script that forgets this prints its result and then hangs, because an open socket keeps the event loop alive.

## Syntax

```js
await db.destroy()
```

## Example

```js
// scripts/report.js
import db from '../db.js';

try {
  const [{ total }] = await db('hotels').count('* as total');
  console.log('hotels:', Number(total));
} finally {
  await db.destroy();
}

// In a server, close the HTTP listener first, then the pool:
// server.close(async () => { await db.destroy(); process.exit(0); });
```

# Router()

Node.js command · Routing

Groups routes in a file that knows only its own paths. The mount path stays in server.js, so a prefix change touches one line.

## Syntax

```js
const router = Router(); app.use("/api", router)
```

## Example

```js
// routers/hotels.js
import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/hotels', async (request, response, next) => {
    try {
        response.json(await db('hotels').select('id', 'name', 'stars'));
    } catch (error) {
        next(error);
    }
});

export default router;

// server.js mounts it. The full path is /api/hotels.
import hotels from './routers/hotels.js';
app.use('/api', hotels);
```

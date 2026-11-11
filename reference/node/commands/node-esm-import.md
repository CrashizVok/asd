# import and export

Node.js command · Modules

The ES module syntax. It needs type: module in package.json, and a relative import needs the file extension.

## Syntax

```js
import name from './file.js';
export default name;
```

## Example

```js
// routes/hotels.js
import express from 'express';
import pool from '../config/db.js';   // extension required in ESM

const router = express.Router();

router.get('/hotels', async (request, response, next) => {
  try {
    const [rows] = await pool.query('SELECT hotel_id, name FROM hotels');
    response.json(rows);
  } catch (error) {
    next(error);
  }
});

export default router;   // imported as: import hotelsRouter from './routes/hotels.js'
```

## Details

Named and default exports coexist: `export function createApp()` is imported with braces, `export default` without. A package can be used from both module systems, but one file cannot mix `import` and `require`.

Omitting `.js` on a relative import produces `ERR_MODULE_NOT_FOUND`, and the message shows the path without an extension, which reads like a typo rather than a missing rule.

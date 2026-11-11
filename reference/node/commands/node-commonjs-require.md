# require and module.exports

Node.js command · Modules

The CommonJS syntax, still the default when package.json has no type field. Relative paths may omit the extension.

## Syntax

```js
const name = require('./file');
module.exports = name;
```

## Example

```js
// config/db.js with CommonJS
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bookings'
});

module.exports = pool;

// routes/hotels.js
// const pool = require('../config/db');
```

## Details

CommonJS runs the file once and caches the exported object, so every `require` of the same path returns the same pool. ESM does the same for the module instance.

`__dirname` exists here and does not exist in ESM. When converting, add `"type": "module"`, change the syntax, and add `.js` to every relative path.

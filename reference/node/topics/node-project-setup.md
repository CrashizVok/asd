# Node project setup

Node.js topic · Exam Wiki

## Simplest form

```js
// Data shape: package.json is one JSON object.
// { name, version, main, type, scripts, dependencies, devDependencies }
// npm init -y writes a minimal version of this object into the current folder.
{
  "name": "bookings-api",
  "version": "1.0.0",
  "main": "server.js"
}
```

## What npm init really does

`npm init` asks a few questions in the terminal and writes one file, `package.json`. That is the whole job. It does not create folders, does not install anything, and does not touch git. In the exam you almost always want the short version:

```bash
mkdir bookings-api
cd bookings-api
npm init -y
npm pkg set type=module
npm install express cors dotenv mysql2
npm install --save-dev nodemon
```

Four commands and the project is ready to write code in. `-y` accepts every default, including the folder name as the package name. `npm pkg set` edits `package.json` without opening an editor, which saves a step when the file is short and you already know the key.

When you run interactive `npm init`, the questions are name, version, description, entry point, test command, git repository, keywords, author, and license. Pressing Enter takes the value in brackets. Only name and version matter for the exam. The rest are metadata that npm prints in a package registry.

The file is read by npm, by the runtime when it starts in some setups, and by tooling. Everything else in the folder is yours.

## Every field in package.json

`name` must be lowercase, may contain hyphens, and cannot contain spaces. It is the folder name npm uses if you ever publish.

`version` follows three numbers, major, minor, patch. Starting at `1.0.0` is normal, and the exam does not care.

`main` is the file Node runs when someone imports the package itself, for example `require('bookings-api')`. A server started with `node server.js` does not use it. Set it anyway because exam checkers and older tools look for it.

`type` decides how `.js` files are parsed. `"module"` means ESM with `import`. `"commonjs"` or no `type` field means `require`. This single line causes more first day errors than any other.

`scripts` holds named shell commands run with `npm run <name>`. Two are special: `start` and `test` run without the word `run`, so `npm start` works.

`dependencies` are packages the running server needs. `devDependencies` are packages used only while developing, such as nodemon, eslint, or a test runner. Production installs skip dev dependencies, which makes the deployed folder smaller.

`engines` states which Node versions work. It is documentation unless a tool enforces it.

`private: true` stops accidental publishing to the public registry. Add it on every exam project.

`files`, `keywords`, `author`, `license`, `repository`, and `bugs` are publishing metadata. They cost nothing and change no behavior.

## dependencies and devDependencies

The difference is where the package is needed. Express, cors, dotenv, and mysql2 run in production, so they go in `dependencies`. Nodemon restarts the server while you type, so it goes in `devDependencies`.

```bash
npm install express          # dependencies
npm install --save-dev nodemon   # devDependencies
npm uninstall cors           # remove from both the folder and the file
```

Three install commands behave differently and the exam likes this question. `npm install` with no arguments reads `package.json` and installs everything. `npm install express` also writes the entry into `package.json`. `npm ci` reads `package-lock.json`, wipes `node_modules`, and installs exactly the locked versions. Use `npm ci` on a build server, because it refuses to run when the lockfile and the manifest disagree.

Version ranges look like `"^4.21.2"`. The caret accepts any later minor or patch release but not a new major. A tilde `"~4.21.2"` accepts patch releases only. A bare `"4.21.2"` pins one version. Caret is the default and is fine for the exam. If a package breaks after a fresh install, pinning is the fix.

`node_modules` is never committed. `package-lock.json` always is, because it records the exact tree you tested.

## ESM and CommonJS

Modern Node supports two module systems. Pick one per project and stay in it.

```js
// ESM, requires "type": "module" in package.json
import express from 'express';
import { readFile } from 'node:fs/promises';

export function createApp() { /* ... */ }
export default createApp;
```

```js
// CommonJS, the default when "type" is missing
const express = require('express');
const { readFile } = require('node:fs/promises');

module.exports = { createApp };
```

The two do not share syntax. An ESM file has no `require`, no `module.exports`, and no `__dirname`. A CommonJS file cannot use `import` at the top level. Mixing them produces errors that look unrelated to the line you edited.

Some practical differences matter in a small server. In ESM, a relative import needs the extension, so `./routes/hotels.js` works and `./routes/hotels` does not. `__dirname` does not exist, so build it from `import.meta.url`:

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM replacement for __dirname.
const here = path.dirname(fileURLToPath(import.meta.url));
```

CommonJS can `require` an ESM package only from a recent Node version, and only for packages without top level await. ESM can import CommonJS packages, and the default export is the `module.exports` object. That one direction is why most tutorials still show `require` for libraries and `import` in application code.

A package can also hold both systems with `"exports"`, mapping `import` and `require` to different files. Skip that in the exam. Choose `"type": "module"`, because the sample backend uses `import`.

## Folder structure

```
bookings-api/
  package.json
  package-lock.json
  .env                 secrets, never committed
  .env.example         key names with empty values, committed
  .gitignore
  server.js            creates the app, mounts routers, listens
  config/
    db.js              one connection pool, exported
  routes/
    hotels.js
    bookings.js
    customers.js
  middleware/
    errors.js          the single error handler
```

The split follows one rule: `server.js` wires things, `routes/` handles one resource per file, `config/` holds connections, `middleware/` holds functions that run before handlers. A beginner puts everything in `server.js` and the file reaches 300 lines by lunch. Splitting at around 100 lines is easier than splitting later.

Two smaller conventions help. Name the router file after the resource, so `hotels.js` exports the hotel endpoints. Keep SQL strings beside the route that runs them unless the query is reused, because a separate `models/` folder costs a file and a mental jump in a four hour exam.

## start and dev scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "db:check": "node scripts/check-db.js"
  }
}
```

`npm start` runs `node server.js`. Every hosting platform calls this script by name, so it must exist and must not need arguments.

`npm run dev` is your local command. `node --watch` is built into Node 18.11 and later and restarts the process when a watched file changes. If the exam machine has an older Node, use nodemon instead.

`npm run` with no name lists every script. `npm run db:check` runs the third one. Scripts can call other tools, so `"lint": "eslint ."` works as soon as eslint is installed.

Scripts run in a shell with `node_modules/.bin` on the path. That means a locally installed binary is found by name without a path, and a global install is not required.

## nodemon

```bash
npm install --save-dev nodemon
```

```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

Nodemon watches the folder and restarts on save. Without configuration it watches `.js`, `.mjs`, `.json`, and ignores `node_modules`. A `nodemon.json` file tunes it:

```json
{
  "watch": ["server.js", "routes", "config", "middleware"],
  "ext": "js,json",
  "ignore": ["node_modules", "*.test.js"],
  "delay": 200
}
```

`delay` waits after a save, which prevents two restarts when an editor writes a file in two steps. `ext` limits the file types that trigger a restart so editing a markdown file does not bounce the server.

Nodemon is a development tool only. Production runs plain `node`, because a crash should be handled by the process manager, not covered up by a restart loop.

## Environment variables and dotenv

```bash
npm install dotenv
```

```js
// server.js, first line of the file
import 'dotenv/config';

const port = Number(process.env.PORT) || 3000;
```

`.env` holds values that differ between machines, and values you must not commit.

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=bookings
```

Three details decide whether this works. The import must come before any module that reads `process.env` at load time, so put it at the top of the entry file. `dotenv/config` is shorthand for `dotenv.config()`, and it does not override variables already set in the shell. Every value arrives as a string, so `PORT` needs `Number(...)` before `app.listen`.

Commit `.env.example` with the same keys and empty or placeholder values. A teammate clones the repo, copies the example, fills in a password, and runs. Without it, the missing key errors start one at a time.

Put `.env` in `.gitignore` before the first commit. Once a password is in git history, removing the file does not remove the password.

## Security basics

The exam backend needs a handful of habits, not a full audit.

Validate at the edge of the request. `Number(req.params.id)` before it reaches SQL, a length check on a string, and a required field check on a POST body. An unchecked `id` becomes a 500 error at best.

Use placeholders in SQL. `pool.query('SELECT * FROM hotels WHERE hotel_id = ?', [id])` sends the value separately from the statement, so quotes in the input cannot change the query. String concatenation is the one mistake that turns a demo into a vulnerability.

Do not return the database error text to the client. Log it, answer with `{ "error": "Server error" }` and status 500. Stack traces and table names help an attacker and confuse a marker.

Keep the JSON body small. `app.use(express.json({ limit: '100kb' }))` stops a giant payload from eating memory.

CORS is not authentication. `app.use(cors())` lets a browser on another origin read your responses. It does not check who is asking. Anyone with curl ignores it. Use it so the React dev server on port 5173 can talk to port 3000, then, if the exam asks for a restricted setup, name the origin:

```js
app.use(cors({ origin: 'http://localhost:5173' }));
```

Run `npm audit` once before you finish. It lists known vulnerable versions from the lockfile. `npm audit fix` updates within the allowed ranges.

For the response headers, a small middleware is enough:

```js
// Minimal hardening without adding a dependency.
app.use((request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  next();
});
```

Never put a real password, token, or API key in a file you commit. `.env` exists for that, and `.gitignore` keeps it out.

## Common errors

`Error: listen EADDRINUSE: address already in use :::3000` means another process has the port. Change `PORT`, or find and stop the other process with `lsof -i :3000`.

`SyntaxError: Cannot use import statement outside a module` means the file uses `import` but the nearest `package.json` has no `"type": "module"`. Add the field or rename the file to `.mjs`.

`ReferenceError: require is not defined in ES module scope` is the same problem in the other direction. The project is ESM and the file uses `require`. Rewrite with `import`.

`Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../routes/hotels'` means an ESM relative import without the extension. Add `.js`.

`npm ERR! Missing script: "dev"` means the script name is not in `package.json`. Copy the exact name, or add the script.

`Error: Cannot find module 'dotenv'` usually means `npm install` ran in a parent folder, so `node_modules` sits one level up and the runtime cannot find it. Install again inside the project folder.

`TypeError: Cannot read properties of undefined (reading 'query')` in a route file usually means a circular import between the router and the database module, so one of them got an empty object at load time. Move the shared value into `config/db.js` and import it from both sides.

`.env` values are `undefined` when the `dotenv` import sits below the import that reads them, or when the file is named `.env.txt`. Check the name with `ls -a`.

`EACCES: permission denied :80` happens when the port is below 1024. Use 3000 or a high port.

## Examples

### Example 1: the smallest package.json that runs a server

```json
{
  "name": "bookings-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

This is what `npm init -y` plus two edits gives you. `type` and `private` are the edits, and both are worth doing on the first minute: `type` fixes the module system for every file, `private` prevents an accidental publish. With this file, `npm install` then `npm start` is a working project as soon as `server.js` exists.

### Example 2: switching one file from CommonJS to ESM

```js
// Before: routes/hotels.js with CommonJS
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM hotels');
  res.json(rows);
});

module.exports = router;
```

```js
// After: same file with ESM, and "type": "module" in package.json
import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM hotels');
  res.json(rows);
});

export default router;
```

Three changes: `require` becomes `import`, `module.exports` becomes `export default`, and the relative path gains `.js`. The path is the part people forget, and the error message names the file without the extension, which looks like a typo rather than a rule.

### Example 3: a dev script with a fallback for an old Node

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "dev:legacy": "nodemon server.js",
    "reset": "rm -rf node_modules && npm ci"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

`dev` is the fast path on a modern Node. `dev:legacy` exists because the exam machine may run Node 16, where `--watch` is an unknown option and the process exits with a usage message. `reset` deletes the install and rebuilds it from the lockfile, which fixes the strange case where a package is half installed.

### Example 4: full project setup, read top to bottom

This is the whole setup for the exam backend. Each block names the file it belongs to and why the line exists.

```bash
# 1. Create the folder and the manifest.
mkdir bookings-api
cd bookings-api
npm init -y

# 2. Switch to ESM before writing any code, so no file needs rewriting later.
npm pkg set type=module
npm pkg set private=true
npm pkg set main=server.js

# 3. Runtime packages.
npm install express cors dotenv mysql2

# 4. Development only, so production installs stay small.
npm install --save-dev nodemon

# 5. Folders for the split that comes later, not for show.
mkdir config routes middleware
```

```json
{
  "name": "bookings-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "server.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "check": "node --check server.js && node --check config/db.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mysql2": "^3.12.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

`check` runs the parser on each entry file without executing it. It catches a missing bracket in a second, before nodemon prints a stack trace. `engines` documents the version the code was written for, which matters when `node --watch` or `fetch` is used.

```bash
# .env: local values, never committed.
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=bookings
```

```bash
# .env.example: same keys, no secrets. This file is committed.
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=bookings
```

```bash
# .gitignore: written before the first commit.
node_modules/
.env
*.log
```

```js
// config/db.js
// One pool for the whole process. A pool reuses connections, so a route does
// not pay the handshake cost on every request.
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bookings',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
```

```js
// routes/hotels.js
// One resource per file. The router is mounted under /api by server.js.
import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/hotels', async (request, response, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT hotel_id, name, city, stars FROM hotels ORDER BY hotel_id'
    );
    response.json(rows);
  } catch (error) {
    // The handler only forwards. server.js decides the status code.
    next(error);
  }
});

router.post('/hotels', async (request, response, next) => {
  const { name, city, stars } = request.body;

  // Validate before the database sees the values.
  if (!name || !city || typeof stars !== 'number') {
    return response.status(400).json({ error: 'name, city and stars are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO hotels (name, city, stars) VALUES (?, ?, ?)',
      [name, city, stars]
    );
    response.status(201).json({ hotel_id: result.insertId });
  } catch (error) {
    next(error);
  }
});

export default router;
```

```js
// server.js
// The entry file: read env, create the app, mount routers, listen.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import hotelsRouter from './routes/hotels.js';

const app = express();

// The React dev server runs on another port, so the browser needs CORS.
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (request, response) => {
  response.json({ ok: true });
});

app.use('/api', hotelsRouter);

// Unknown route, so the client gets JSON and not an HTML error page.
app.use((request, response) => {
  response.status(404).json({ error: 'Not found' });
});

// One error handler for every route. Four parameters, or Express ignores it.
app.use((error, request, response, next) => {
  console.error(error);
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Invalid JSON body' });
  }
  response.status(500).json({ error: 'Server error' });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
```

The order of the `app.use` calls is the design. CORS and the body parser come before the routes because they must run on every request. Routers come before the 404 handler, or every route would be swallowed. The error handler comes last and takes four arguments, which is how Express recognizes it as an error handler instead of middleware.

To start: `npm run dev` while writing, `npm start` for the final check. If the server prints nothing, the port is taken or the file threw during import; read the first line of the stack, not the last.

## Common mistakes

Creating `package.json` in the home folder. Then `npm install` tries to treat your whole home directory as a package, and the exam machine gets slower for no reason. Run `pwd` first.

Forgetting `"type": "module"` and writing `import` anyway. The error points at the import line, but the fix is in `package.json`.

Committing `.env`. The password reaches the git history and stays there. Write `.gitignore` before the first commit, not after the first push.

Installing nodemon as a regular dependency. Production then downloads a file watcher it never runs.

Reading `process.env.PORT` without `Number(...)`. `app.listen('3000')` works by accident because Express coerces a numeric string, but `Number` makes arithmetic and comparisons work, and the habit prevents a bug with `port + 1`.

Putting `dotenv.config()` after the import of a module that reads the environment at load time. The module sees `undefined`, so the pool connects to the default host and the mistake looks like a database problem.

Adding a route after the 404 handler. The request never reaches it, and the response is always `Not found`.

Using `cors()` as a replacement for a login check. Any script outside the browser can call the API.

String concatenation in SQL. `WHERE name = '${name}'` accepts a quote character from the user and runs the rest as SQL.

Committing `node_modules`. A thousand files, no value, and a repository that clones slowly.

Running `npm audit fix --force` on the exam machine ten minutes before the deadline. It changes major versions and can break the app. Read the report, fix one package, rerun the tests.

## Exam checklist

- `package.json` exists inside the project folder, not one level up.
- `"type": "module"` is set and every import matches it.
- `npm start` works from a clean clone: `npm ci` then `npm start`.
- `npm run dev` restarts on save, whether with nodemon or `node --watch`.
- `dependencies` holds express, cors, dotenv, mysql2; `devDependencies` holds nodemon.
- `.env` is in `.gitignore`, `.env.example` is committed, and the keys match.
- Every environment value used in code has a fallback or a clear startup error.
- The folder split is `server.js`, `config/`, `routes/`, `middleware/`, and no file is over about 120 lines.
- CORS is limited to the frontend origin, or the open form is a deliberate exam choice you can explain.
- SQL uses `?` placeholders, and the client never receives raw error text.
- 404 handler and error handler sit after the routes, in that order.
- No secret appears in any committed file.


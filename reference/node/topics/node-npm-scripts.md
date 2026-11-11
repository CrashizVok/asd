# npm, package.json, and environment

Node.js topic · Exam Wiki

## Simplest form

```js
// Data shape: scripts is an object of name -> shell command.
// { "scripts": { "<name>": "<command>" } }
// npm run <name> executes the command with node_modules/.bin first on PATH.
{
  "scripts": {
    "start": "node server.js"
  }
}
```

## How npm run works

`npm run build` looks up `scripts.build` in the nearest `package.json`, then hands the string to a shell. On Linux and macOS that shell is `sh`, on Windows it is `cmd.exe`. The process inherits your environment plus one important addition: `node_modules/.bin` is prepended to `PATH`.

That addition is why `"dev": "nodemon server.js"` works without a full path and without a global install. It is also why a missing script fails with `npm ERR! Missing script:` and a typo'd binary fails with `sh: nodemon: command not found`.

The exit code of the command becomes the exit code of `npm run`. A test script that exits 1 makes the CI job red, so do not swallow errors with `|| true` unless you mean it.

`start` and `test` are special names and run without the word `run`: `npm start`, `npm test`. Everything else needs the prefix, although `npm run` with no arguments prints the list so you never have to guess a name.

## The npm commands worth memorizing

`npm init -y` writes a default `package.json` in the current folder.

`npm install` with no arguments installs everything listed in `package.json` and respects the lockfile.

`npm install express` installs and records the package in `dependencies`.

`npm install --save-dev nodemon` records it in `devDependencies`. `-D` is the short form.

`npm ci` deletes `node_modules` and installs exactly what `package-lock.json` says. It fails when the manifest and lockfile disagree, which is the point.

`npm uninstall cors` removes the package and its entry.

`npm run` lists scripts, `npm run dev` runs one. `npm start` is the shortcut for `start`.

`npm ls --depth=0` prints the installed top level packages and marks unmet or extraneous ones. Faster than reading `node_modules`.

`npm outdated` shows packages with newer versions allowed by your ranges.

`npm audit` lists known vulnerabilities in the installed tree. `npm audit fix` updates within the existing ranges.

`npm pkg get scripts` and `npm pkg set scripts.dev="nodemon server.js"` read and write single fields without an editor. Handy in a terminal-only exam setup.

`npm config get registry` tells you where packages come from, which is the first question when an install hangs.

## Script hooks

npm runs `pre<name>` before `<name>` and `post<name>` after it, for any script name.

```json
{
  "scripts": {
    "predev": "node scripts/check-env.js",
    "dev": "nodemon server.js",
    "postinstall": "node scripts/copy-example-env.js"
  }
}
```

`predev` runs before `npm run dev`, so a missing `.env` stops the server with a readable message instead of a database timeout. `postinstall` runs after every install, which is a common place to bootstrap a config file and a common place to hide surprise work. Keep it short and quiet.

There is no hook for `npm ci` beyond `preci` and `postci`, and those are unusual enough to confuse a marker. Use a real script name instead.

## Passing arguments

Arguments after `--` reach the underlying command, not npm.

```json
{
  "scripts": {
    "lint": "eslint .",
    "test": "node --test"
  }
}
```

```bash
npm run lint -- --fix          # becomes: eslint . --fix
npm test -- --watch            # becomes: node --test --watch
```

Without the separator, npm may consume the flag itself or pass it to the wrong place. The rule is simple: everything you want the tool to see goes after `--`.

Inline environment values are a shell feature, so the syntax differs by platform, which is exactly why most projects use dotenv instead:

```bash
# Linux and macOS only
PORT=4000 npm start
```

```json
{
  "scripts": {
    "start:prod": "node server.js"
  }
}
```

Set `NODE_ENV` in the environment or in the deployment settings, and read it in code. A script that hardcodes `NODE_ENV=production` breaks on Windows, and the exam machine may be either.

## dotenv in depth

```bash
npm install dotenv
```

```js
// server.js
import 'dotenv/config';
```

`dotenv/config` reads `.env` from the current working directory, parses `KEY=value` lines, and assigns anything that is not already in `process.env`. Existing variables win, so a real deployment variable is never overwritten by a stale local file.

The function form takes options:

```js
import dotenv from 'dotenv';

// Load a named file, and allow it to override values inherited from the shell.
const result = dotenv.config({ path: '.env.local', override: true });

if (result.error) {
  console.error('No .env.local found, falling back to defaults');
}
```

`path` picks the file. `override: true` flips the precedence, which is what you want for a test file that must not inherit a developer's `DB_NAME`. `result.error` exists so a missing file can be reported instead of silently producing `undefined` settings. `quiet: true` suppresses the banner some versions print.

Parsing rules that matter. `PORT=3000` gives the string `"3000"`, never a number. `DEBUG=false` is the string `"false"`, which is truthy, so compare with `=== 'true'`. `NAME=Danube View` keeps the space, while `NAME="Danube View"` strips the quotes. A `#` starts a comment only at the start of a line or after whitespace, so a password containing `#` should be quoted.

Values are read once, at startup. Changing `.env` requires a restart, and `node --watch` does not watch it unless you add the file to the watch list.

`.env.example` belongs in the repository. `.env` does not.

## Environment variables in code

Read the environment in one place and export typed values, so routes never deal with strings:

```js
// config/env.js
// Reads and checks the environment once, at import time.
const port = Number(process.env.PORT || 3000);

if (Number.isNaN(port)) {
  throw new Error('PORT must be a number');
}

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'bookings'
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
```

A failed `throw` during import stops the process with a clear message. That is better than a pool that silently connects to `localhost` on the exam machine when the real host was misspelled.

Secrets stay out of the client. Anything in a React build is public, so an API key read by the frontend is not secret. The server holds it, the frontend calls the server.

CORS origin comes from the environment for the same reason the port does. One variable, one place to change when the frontend moves:

```js
import cors from 'cors';
import { env } from './config/env.js';

app.use(cors({ origin: env.corsOrigin }));
```

## package.json fields that affect scripts

`engines` warns or fails depending on your npm configuration. It is the only place that records "this needs Node 18 for `node --watch`".

`bin` maps a command name to a file, which is how a package provides a CLI. You rarely write it, but it explains how `nodemon` ends up in `node_modules/.bin`.

`workspaces` lets one repository hold several packages that share one install. Useful for a monorepo, unnecessary in the exam.

`config` holds values that scripts read through `npm_package_config_<key>`. It is legacy, and a plain constant in a script file is easier to follow.

`packageManager` pins the npm version when corepack is enabled. Skip it unless the task asks.

## Ranges and the lockfile

`"express": "^4.21.2"` accepts 4.22.0 but not 5.0.0. `"~4.21.2"` accepts 4.21.9 but not 4.22.0. `"4.21.2"` accepts only that one. `"*"` accepts anything, which makes the project non reproducible and is never the right answer.

`package-lock.json` records the resolved tree, including transitive packages. Commit it. When `npm install` and `npm ci` disagree about what to do, `npm ci` is right for a clean build and `npm install` is right while you are adding something.

If a fresh clone behaves differently from your machine, the lockfile is the usual cause. `npm ci` then `npm start` reproduces the tested tree.

## Common errors

`npm ERR! Missing script: "dev"` means the key is absent. `npm run` prints the keys that exist.

`sh: nodemon: command not found` means it is not installed locally. `npm install --save-dev nodemon`, then run through npm so `node_modules/.bin` is on the path.

`npm ERR! code EJSONPARSE` means `package.json` has a trailing comma or a comment. JSON allows neither.

`npm ERR! ERESOLVE unable to resolve dependency tree` means two packages want incompatible versions of a third. `npm install --legacy-peer-deps` usually gets past it, and the honest fix is to align the versions.

`npm ERR! EACCES` means npm tried to write where it lacks permission, usually a global install without `sudo`. Prefer a local install; a global one is rarely needed.

`process.env.PORT` is `undefined` inside the app but set in `.env`. Check that `dotenv/config` is imported first, that the file is named `.env` and sits where npm ran, and that the key has no space before `=`.

`TypeError: Cannot read properties of undefined` on a config object usually means the code read `process.env` at module load before dotenv ran. Import order fixes it.

`SyntaxError: Invalid or unexpected token` after editing a script means a quote got closed inside the JSON string. JSON strings need escaped quotes, and shell quoting inside them is the usual trap.

## Examples

### Example 1: a scripts block for one server

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "check": "node --check server.js",
    "env": "node -e \"console.log(process.env.PORT || 'no PORT set')\""
  }
}
```

Four lines, each with a job. `start` is what the platform calls. `dev` restarts on save. `check` parses the entry file without running it, which catches bracket errors in a second. `env` prints one variable, and it is the fastest way to prove whether npm sees your environment at all.

### Example 2: passing arguments through

```json
{
  "scripts": {
    "lint": "eslint .",
    "test": "node --test tests/",
    "test:one": "node --test tests/"
  }
}
```

```bash
npm run lint -- --fix
npm run test:one -- tests/hotels.test.js
npm test -- --watch
```

Each `--` drops everything after it onto the end of the script command. In the second line the file argument replaces nothing; it is appended, so `node --test tests/ tests/hotels.test.js` runs and Node deduplicates the suite. If you need replacement rather than appending, write two scripts.

### Example 3: three ways to load the environment

```js
// 1. The shortest form, for a small server with one .env file.
import 'dotenv/config';
console.log(process.env.DB_HOST);
```

```js
// 2. Explicit, with an error you can read, for a project that must fail loudly.
import dotenv from 'dotenv';

const loaded = dotenv.config();

if (loaded.error) {
  console.error(`Could not read .env: ${loaded.error.message}`);
  process.exit(1);
}

console.log(process.env.DB_HOST);
```

```js
// 3. Two files, a shared default and a local override, for a team setup.
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });          // committed defaults
dotenv.config({ path: '.env.local', override: true });  // personal values, ignored by git
```

The first form is what the exam needs. The second is worth the extra lines when a missing file would otherwise show up as a confusing database timeout. The third shows the precedence rule: the second call overrides only because it says so.

### Example 4: full setup, manifest to running server

This example is the whole environment story for the exam backend. Read the comments; they explain the choices, not the syntax.

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
    "check": "node --check server.js",
    "smoke": "node scripts/smoke.js",
    "pretest": "npm run check",
    "test": "node --test tests/",
    "db:ping": "node scripts/ping-db.js"
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

`pretest` runs the parser check before the test suite, so a syntax error is reported as a syntax error and not as a failing test. `smoke` and `db:ping` are small scripts you can run by name during the exam instead of retyping a `node -e` one-liner under pressure.

```bash
# .env.example, committed, same keys as .env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=bookings
```

```js
// config/env.js
// One import that reads, converts and validates every environment value.
import dotenv from 'dotenv';

const loaded = dotenv.config();
if (loaded.error) {
  console.warn('.env not found, using defaults');
}

function number(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (Number.isNaN(value)) throw new Error(`${name} must be a number, got "${raw}"`);
  return value;
}

export const env = {
  port: number('PORT', 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: number('DB_PORT', 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'bookings'
  }
};

// A one line summary at startup. No password in the output.
if (env.nodeEnv !== 'test') {
  console.log(`env: ${env.nodeEnv}, db: ${env.db.user}@${env.db.host}:${env.db.port}/${env.db.name}`);
}
```

```js
// config/db.js
// The pool is created from the validated object, never from process.env directly.
import mysql from 'mysql2/promise';
import { env } from './env.js';

const pool = mysql.createPool({
  ...env.db,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
```

```js
// scripts/ping-db.js
// Run with: npm run db:ping
// Answers "is the database reachable" before you debug a route.
import pool from '../config/db.js';

try {
  const [rows] = await pool.query('SELECT 1 AS ok');
  console.log('database reachable:', rows[0].ok === 1);
} catch (error) {
  console.error('database not reachable:', error.code || error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
```

```js
// scripts/smoke.js
// Run with: npm run smoke, while the server is up on PORT.
// Checks the two endpoints a marker will try first.
const base = `http://localhost:${process.env.PORT || 3000}`;

for (const path of ['/api/health', '/api/hotels']) {
  const response = await fetch(`${base}${path}`);
  const body = await response.text();
  console.log(path, response.status, body.slice(0, 80));
}
```

The order of operations at the start of a session: `npm ci`, copy `.env.example` to `.env`, `npm run db:ping`, `npm run dev`, `npm run smoke`. Each step names the layer that failed. That is worth more than a long stack trace, and it fits in one line of the terminal.

## Common mistakes

Running npm in the wrong folder. The nearest `package.json` wins, so a stray one in your home directory catches installs from anywhere below it.

Writing a script that only works in bash. `rm -rf`, `$(...)` and `VAR=x cmd` fail in `cmd.exe`. The cross platform version is a tiny Node script called by name.

Forgetting `--` when forwarding flags. `npm test --watch` makes npm look for a script called `watch` and fail.

Depending on the order of two `dotenv.config` calls without `override`. The first file wins for any key present in both.

Putting real values in `.env.example`. The file is committed, so it becomes a leaked secret with a helpful name.

Converting a numeric environment value inside a route instead of at the edge. Every route repeats the check, and one of them forgets it.

Reading `process.env` in a database module that is imported before dotenv runs. Import order is the whole fix.

Treating `NODE_ENV` as a setting that changes behavior automatically. Express reads it for a couple of defaults, and your code must check it itself.

Adding a build step to a backend that has no build step. `start` should run the source, or the exam machine needs a second command that nobody remembers.

Calling `npm audit fix --force` minutes before the deadline. It jumps major versions and can break the app.

## Exam checklist

- `npm start` runs from a clean folder after `npm ci` alone.
- `npm run` lists every script you rely on, and each name is spelled the same in the notes and the manifest.
- `start` needs no arguments and no flags to work.
- Development restart is either nodemon or `node --watch`, and both are documented in one line.
- `dotenv/config` is the first import of the entry file.
- Every numeric environment value passes through `Number` once, in one config module.
- `.env.example` matches `.env` key for key; `.env` is ignored by git.
- `CORS_ORIGIN` comes from the environment and is used by the cors middleware.
- `package-lock.json` is committed, and ranges use `^` rather than `*`.
- `npm run db:ping` and `npm run smoke` exist and print one readable line.
- No secret, password, or token appears in `package.json`, a script, or the repository.
- You can explain why `npm ci` differs from `npm install` in one sentence.


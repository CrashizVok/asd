# .env and .env.example

Node.js command · Environment

One key per line, no quotes needed for simple values. .env stays out of git; .env.example is committed with the same keys.

## Syntax

```js
KEY=value
```

## Example

```js
# .env, local values, listed in .gitignore
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=bookings

# .env.example, committed, same keys, no secret values
# PORT=3000
# DB_USER=
# DB_PASSWORD=
```

## Details

A `#` starts a comment at the start of a line or after whitespace, so a password containing `#` must be quoted. `NAME=Danube View` keeps the space; `NAME="Danube View"` drops the quotes.

Write `.gitignore` before the first commit. Removing `.env` later does not remove the password from git history.

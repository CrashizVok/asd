# scripts

Node.js command · Scripts

The named commands npm can run. start and test are the two names that run without the word run.

## Syntax

```js
"scripts": { "start": "node server.js", "dev": "nodemon server.js" }
```

## Example

```js
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "check": "node --check server.js",
    "db:ping": "node scripts/ping-db.js",
    "smoke": "node scripts/smoke.js"
  }
}

# node --check parses a file without running it, so a typo is reported
# before the server tries to connect to MySQL.
```

## Details

`start` must work with no arguments, because hosting platforms and markers call it by name. `check` costs one line and catches a syntax error in a second.

Names with a colon group related commands, for example `db:ping` and `db:seed`, and `npm run` lists them in one block.

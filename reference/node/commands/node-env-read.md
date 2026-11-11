# process.env

Node.js command · Environment

Reads an environment variable. Values are strings or undefined, so convert numbers and compare booleans explicitly.

## Syntax

```js
const port = Number(process.env.PORT) || 3000;
```

## Example

```js
// Convert once, at the edge, then export typed values.
const port = Number(process.env.PORT || 3000);
const debug = process.env.DEBUG === 'true';   // "false" is a truthy string

if (Number.isNaN(port)) {
  throw new Error('PORT must be a number');
}

console.log({ port, debug, nodeEnv: process.env.NODE_ENV });
```

## Details

`process.env.PORT` is the string `"3000"`, not the number. `Number(...)` or `parseInt(..., 10)` fixes arithmetic; a `||` fallback covers the missing case.

A variable that is set to an empty string is not missing. `process.env.DB_PASSWORD || 'default'` treats both as missing, which is usually what you want for a password field.

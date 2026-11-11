# package.json

Node.js command · Setup

The manifest npm reads. It names the project, chooses the module system, lists commands and records installed packages.

## Syntax

```js
{
  "name": "bookings-api",
  "type": "module",
  "scripts": {},
  "dependencies": {}
}
```

## Example

```js
{
  "name": "bookings-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "server.js",
  "engines": { "node": ">=18" },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "dotenv": "^16.4.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

## Details

`type` is the field that decides how every `.js` file is parsed: `"module"` for `import`, anything else for `require`. `main` is only used when the package is imported as a package, not when you run `node server.js`.

The caret range `^4.21.2` accepts newer minor and patch releases but not a new major version. A trailing comma anywhere in this file stops npm with `EJSONPARSE`.

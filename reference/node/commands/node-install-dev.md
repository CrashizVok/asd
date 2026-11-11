# npm install --save-dev

Node.js command · Dependencies

Installs a package used only during development, so a production install can skip it.

## Syntax

```js
npm install --save-dev <package>
```

## Example

```js
# Nodemon restarts the server while you edit. Production never runs it.
npm install --save-dev nodemon

# The short form writes the same field.
npm install -D eslint

# npm ci --omit=dev installs runtime packages only, as a deploy would.
npm ci --omit=dev
```

## Details

Anything that only watches files, lints, or runs tests belongs in `devDependencies`. Express, cors, dotenv and mysql2 belong in `dependencies` because the server imports them at runtime.

Putting nodemon in `dependencies` still works, and it makes every deploy larger for a tool that is never started.

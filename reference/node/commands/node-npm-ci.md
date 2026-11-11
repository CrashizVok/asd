# npm ci

Node.js command · Dependencies

Installs exactly the versions in package-lock.json, after deleting node_modules. It fails when the manifest and lockfile disagree.

## Syntax

```js
npm ci
```

## Example

```js
# Reproduce the tested tree on a fresh clone or a build server.
npm ci

# Runtime packages only, for a deploy folder.
npm ci --omit=dev

# If it fails with a lockfile mismatch, refresh the lock and try again.
npm install
npm ci
```

## Details

`npm install` may update the lockfile; `npm ci` never does. That difference is why a build pipeline uses `npm ci` and why the same word in the exam answer is usually worth the point.

Commit `package-lock.json`. Without it `npm ci` cannot run.

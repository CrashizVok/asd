# nodemon

Node.js command · Scripts

Restarts the Node process when a watched file changes. A development tool, installed with --save-dev.

## Syntax

```js
nodemon <entry-file>
```

## Example

```js
# Install locally, then call it through npm so node_modules/.bin is on PATH.
npm install --save-dev nodemon

# package.json
# "dev": "nodemon server.js"
npm run dev

# Optional nodemon.json beside package.json
# {
#   "watch": ["server.js", "routes", "config"],
#   "ext": "js,json",
#   "ignore": ["node_modules"],
#   "delay": 200
# }
```

## Details

Node 18.11 and later ship `node --watch`, which does the same job with no dependency. Use nodemon when the machine may run an older Node, and say why in a comment.

`delay` waits a moment after a save so an editor that writes a file twice does not trigger two restarts.

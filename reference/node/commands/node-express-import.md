# import express from 'express'

Node.js command · Setup

Loads the Express module. With "type": "module" in package.json this is the ESM form; older projects use require('express').

## Syntax

```js
import express from 'express';
```

## Example

```js
// server.js
import express from 'express';

const app = express();
console.log(typeof app); // function
console.log(typeof app.listen); // function
```

## Details

The default export is a factory function, not an app. Calling it gives you the application object.

```js
// CommonJS variant, same module.
const express = require('express');
const app = express();
```

If you get `Cannot use import statement outside a module`, the nearest `package.json` is missing `"type": "module"`. Do not mix both styles in one file.

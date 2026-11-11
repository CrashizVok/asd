# express()

Node.js command · Setup

Creates the application object: an ordered list of middleware and routes plus the settings that go with them.

## Syntax

```js
const app = express();
```

## Example

```js
import express from 'express';

const app = express();

// The app is a request handler, so it can be handed to http.createServer.
app.get('/', (request, response) => response.send('hello'));

app.listen(3000);
```

## Details

One process usually creates one app. Tests create several, one per case, because a used port and a shared middleware stack make tests interfere with each other.

Useful settings:

- `app.set('trust proxy', 1)` behind a reverse proxy, so `req.ip` is the client address.
- `app.disable('x-powered-by')` removes the header that announces Express.

Mounting the app under a path in another app is rare in exam work; mounting a router is the normal move.

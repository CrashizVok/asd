# app.listen()

Node.js command · Setup

Binds a port, starts accepting connections, and returns the http.Server. The callback runs once the port is open, not on every request.

## Syntax

```js
const server = app.listen(port, callback)
```

## Example

```js
// PORT from the environment keeps the app usable in a container.
const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});

// server.close() stops accepting new connections, used in tests and shutdown.
process.on('SIGINT', () => server.close(() => process.exit(0)));
```

## Details

`Number(process.env.PORT)` matters: an environment variable is a string and `'0'` is truthy, while `|| 3000` on a raw string also works but hides the conversion.

The callback is for logging and setup after the bind. A request handler never goes there.

If the port is taken the process throws `EADDRINUSE` and exits. Check for a server you already started before changing the port.

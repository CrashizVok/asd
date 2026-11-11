# app.use()

Node.js command · Middleware

Adds a layer that runs for every method and every path under the optional prefix. It runs in registration order, before the routes below it.

## Syntax

```js
app.use([path], middleware)
```

## Example

```js
// Runs for every request, including the ones that end in a 404.
app.use((request, response, next) => {
    console.log(`${request.method} ${request.originalUrl}`);
    next();
});

// Runs only for paths that start with /api.
app.use('/api', (request, response, next) => {
    response.set('X-Api-Version', '1');
    next();
});
```

## Details

`use` matches by prefix, not by whole path: `app.use('/api', fn)` also runs for `/api/hotels/4?city=Eger`. A route registered with `app.get` matches the whole path instead.

Inside a mounted middleware the prefix is removed from `req.url` but `req.originalUrl` keeps it, which is what you log.

Two uses you will write in every exam answer: the request log near the top, and the catch all 404 at the bottom.

# catch all 404

Node.js command · Errors

A middleware with no path, registered after every route. It answers requests that matched nothing.

## Syntax

```js
app.use((request, response) => { ... })
```

## Example

```js
app.use('/api', hotelsRouter);
app.use('/api', bookingsRouter);

// No path and no method filter, so this runs whenever nothing above answered.
app.use((request, response) => {
    response.status(404).json({ error: `No route for ${request.method} ${request.path}` });
});
```

## Details

Putting it above a route hides that route: this layer matches everything and ends the response.

A request that reached a route but found no row is also a 404, but it is answered inside the route, not here. This one is only for unknown paths.

A 404 for a path must not become a 500 when the path is odd. `request.path` is already a string; no parsing is needed.

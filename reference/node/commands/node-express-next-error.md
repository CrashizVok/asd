# next(error)

Node.js command · Errors

Skips every remaining normal layer and runs the first error handler. Used in async routes so a rejected query does not hang the request.

## Syntax

```js
next(error)
```

## Example

```js
app.get('/api/hotels', async (request, response, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hotels');
        response.json(rows);
    } catch (error) {
        next(error);   // jumps to the error handler, skipping the 404 layer
    }
});
```

## Details

Express 4 does not look at the promise an async handler returns. A rejection that is not caught becomes an unhandled rejection and the request waits forever, so `try/catch` plus `next(error)` is mandatory in Express 4 code.

Pass an `Error`, not a string. `error.status = 400` before `next` lets the handler pick the code:

```js
const error = new Error('Hotel not found');
error.status = 404;
next(error);
```

Anything after `next(error)` in the same block still runs, so `return next(error)` is the safe form.

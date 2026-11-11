# next()

Node.js command · Middleware

Hands control to the next matching layer. Without it a middleware that does not answer leaves the request waiting.

## Syntax

```js
next()
```

## Example

```js
app.use((request, response, next) => {
    const started = Date.now();

    // 'finish' runs after the answer, so the status and time are known here.
    response.on('finish', () => {
        console.log(`${request.method} ${request.path} ${response.statusCode} ${Date.now() - started}ms`);
    });

    next();   // omit this and every request hangs
});
```

## Details

`next()` does not stop the current function. Code after it still runs, so a middleware that both calls `next()` and sends a response sends twice:

```js
next();
response.json({ ok: true });   // ERR_HTTP_HEADERS_SENT
```

`next('route')` inside a route handler skips the rest of that route and tries the next match. It has no effect inside `app.use`.

Calling `next()` inside a callback that runs later (a timer, a database callback) is fine, because the chain position is kept.

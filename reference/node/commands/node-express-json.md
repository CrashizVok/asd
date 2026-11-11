# express.json()

Node.js command · Middleware

Body parser for application/json. It fills req.body and calls next(error) when the JSON is malformed.

## Syntax

```js
app.use(express.json([options]))
```

## Example

```js
app.use(express.json({ limit: '100kb' }));

app.post('/api/hotel', (request, response) => {
    // request.body is now an object
    response.status(201).json({ received: Object.keys(request.body ?? {}) });
});

app.use((error, request, response, next) => {
    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({ error: 'Invalid JSON body' });
    }
    next(error);
});
```

## Details

Register it before the routes that need it. A parser mounted after a route has no effect on that route.

Useful options: `limit` caps the payload size, `strict: false` accepts a bare JSON value such as `42` or `"text"` instead of requiring an object or array.

The parse error carries `type: 'entity.parse.failed'` and `status: 400`. Without a branch for it the client gets a 500 for its own malformed JSON, which hides the real cause.

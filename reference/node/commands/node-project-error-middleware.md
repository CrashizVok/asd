# errorHandler(error, request, response, next)

Node.js command · Errors

The one place that turns an error into a response. Express finds it by its four parameters and it must be registered after every route.

## Syntax

```js
app.use((error, request, response, next) => { ... })
```

## Example

```js
export function errorHandler(error, request, response, next) {
    // express.json() failed to parse the body.
    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({ error: 'Invalid JSON body' });
    }
    if (error instanceof HttpError) {
        return response.status(error.status).json({ error: error.message });
    }
    const mapped = {
        ER_DUP_ENTRY: [409, 'That row already exists'],
        ER_NO_REFERENCED_ROW_2: [400, 'The customer or hotel does not exist'],
    }[error.code];
    if (mapped) {
        return response.status(mapped[0]).json({ error: mapped[1] });
    }
    console.error(request.method, request.originalUrl, error);
    response.status(500).json({ error: 'Server error' });
}

app.use(notFound);
app.use(errorHandler);
```

## Details

Removing `next` from the signature turns the function into ordinary middleware, which Express calls on normal requests and which never sees an error. Keep all four parameters even when the last one is unused.

# error handler

Node.js command · Errors

Four parameters, registered last. Express counts the parameters to recognise it, and it runs only for errors passed to next or thrown in synchronous code.

## Syntax

```js
app.use((error, request, response, next) => { ... })
```

## Example

```js
app.use((error, request, response, next) => {
    console.error(error.stack);

    if (response.headersSent) {
        return next(error);   // the body already started, let Express close it
    }
    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({ error: 'Invalid JSON body' });
    }

    response.status(error.status ?? 500).json({ error: error.message ?? 'Server error' });
});
```

## Details

Three parameters makes it a normal middleware, which never receives an error. Five still works, but the extra one is unused. Write four.

In production, answer with a generic message and log the detail. `error.message` can contain a table name, a SQL fragment or a file path.

A second error handler below the first runs only if the first calls `next(error)`. That is how a JSON handler and a plain text handler can share one app.

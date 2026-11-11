# async handler with next(error)

Node.js command · Errors

Express 4 does not catch a rejected promise, so every async handler needs its own try/catch. Without it the client waits until timeout.

## Syntax

```js
async (request, response, next) => { try { ... } catch (error) { next(error); } }
```

## Example

```js
router.get('/hotels', async (request, response, next) => {
    try {
        const rows = await db('hotels').select('id', 'name');
        response.json(rows);
    } catch (error) {
        // The error middleware is the only place that writes status codes.
        next(error);
    }
});
```

## Details

Express 5 forwards rejected promises to the error middleware by itself. Code written with the try/catch works on both versions and shows the reader that the handler can fail.

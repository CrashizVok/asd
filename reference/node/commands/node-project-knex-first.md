# .first()

Node.js command · Queries

Adds LIMIT 1 and resolves to the row object or undefined. It does not throw when nothing matches, so the route checks and returns 404.

## Syntax

```js
query.first()
```

## Example

```js
router.get('/hotels/:id', async (request, response, next) => {
    try {
        const id = integer(request.params.id, 'id', { min: 1 });
        const hotel = await db('hotels').where({ id }).first();
        if (!hotel) {
            throw new HttpError(404, 'Hotel not found');
        }
        response.json(hotel);
    } catch (error) {
        next(error);
    }
});
```

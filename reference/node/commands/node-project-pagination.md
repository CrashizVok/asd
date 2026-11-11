# limit() and offset()

Node.js command · Queries

Slices a long result into pages. Cap the page size, order by a unique column, and read the numbers from query strings before they reach SQL.

## Syntax

```js
query.limit(size).offset((page - 1) * size)
```

## Example

```js
// GET /api/hotels?page=2&size=20
const page = request.query.page === undefined
    ? 1
    : integer(request.query.page, 'page', { min: 1, max: 10000 });
const size = request.query.size === undefined
    ? 20
    : integer(request.query.size, 'size', { min: 1, max: 100 });

const rows = await db('hotels')
    .select('id', 'name', 'stars')
    // A unique tiebreaker stops rows from repeating across pages.
    .orderBy([{ column: 'name', order: 'asc' }, { column: 'id', order: 'asc' }])
    .limit(size)
    .offset((page - 1) * size);

response.json({ page, size, rows });
```

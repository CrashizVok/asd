# .select()

Node.js command · Queries

Lists the columns of a select. An object argument renames each column in the result, which is how a join avoids duplicate names.

## Syntax

```js
db('hotels').select('id', 'city', 'stars')
```

## Example

```js
// GET /api/hotels
const rows = await db('hotels')
    .select('id', 'city', 'name', 'stars')
    .orderBy('name', 'asc');

// Same query with aliases, used when two tables share a column name.
const joined = await db('hotels as h')
    .select({
        hotel_id: 'h.id',
        hotel_name: 'h.name',
        owner_email: 'h.owner_email',
    });

response.json(rows);
```

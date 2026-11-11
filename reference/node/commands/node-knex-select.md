# select()

Node.js command · Queries

Lists the columns to return. The result is an array of plain objects with one key per column.

## Syntax

```js
db('hotels').select('id', 'name', 'stars')
```

## Example

```js
// rows: [{ id: 1, name: 'Danube View', stars: 4 }, ...]
const rows = await db('hotels').select('id', 'name', 'stars');

// Aliases: the object key becomes the column name in the result.
const owners = await db('hotels as h')
  .join('customers as c', 'c.email', 'h.owner_email')
  .select({ hotel: 'h.name', owner: 'c.last_name' });

// select('*') sends every column, including a 500 character image URL
// and a TEXT description, on every list request.
```

## Details

Two tables with a `name` column produce one key that overwrites the other in the object. Alias at least one side.

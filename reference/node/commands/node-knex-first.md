# first()

Node.js command · Queries

Runs the query with `LIMIT 1` and resolves to one row, or to `undefined` when nothing matches. No array to unwrap.

## Syntax

```js
.first() | .first('name')
```

## Example

```js
const hotel = await db('hotels').where('id', 1).first();
if (!hotel) {
  // undefined, not an empty object: check before reading a column.
  return res.status(404).json({ error: 'Hotel not found' });
}
console.log(hotel.name);

// One column only: the value itself, or undefined.
const name = await db('hotels').where('id', 1).first('name');
```

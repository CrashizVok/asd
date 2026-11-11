# update()

Node.js command · Writes

Updates the rows the builder selects and resolves to the number of affected rows.

## Syntax

```js
.update(patch)
```

## Example

```js
const affected = await db('hotels').where('id', 1).update({ stars: 4 });
console.log(affected); // 1

// Arithmetic happens in the server, so concurrent requests both count.
await db('hotels').where('id', 1).increment('stars', 1);
await db('hotels').where('id', 1).decrement('stars', 1);

// A patch built from a request body needs a fixed key list.
const allowed = ['city', 'name', 'description', 'stars', 'image'];
const changes = Object.fromEntries(
  Object.entries(req.body).filter(([key]) => allowed.includes(key))
);
if (Object.keys(changes).length > 0) {
  await db('hotels').where('id', req.params.id).update(changes);
}
```

## Details

MySQL counts changed rows, not matched rows. Sending the same values again returns 0, so 0 means either no row or no difference. A `select` in the same transaction tells them apart. An empty patch object makes knex throw.

# returning()

Node.js command · Writes

Asks for the written row back. MySQL has no RETURNING clause, so knex warns and ignores it. Read the insert id or select again instead.

## Syntax

```js
.returning('id')
```

## Example

```js
// Warning on MySQL: .returning() is not supported and has no effect.
const result = await db('hotels')
  .insert({ city: 'Eger', name: 'Hill House' })
  .returning('id');
// result is still [insertId], not [{ id: 4 }]

// Portable pattern: insert, then read the row by its id.
const [id] = await db('hotels').insert({
  city: 'Eger',
  name: 'Hill House',
  stars: 3,
  owner_email: 'anna.kovacs@example.com',
});
const created = await db('hotels').where('id', id).first();

// For an update, read inside the same transaction so nothing slips between.
await db.transaction(async (trx) => {
  await trx('hotels').where('id', id).update({ stars: 4 });
  const row = await trx('hotels').where('id', id).first();
  return row;
});
```

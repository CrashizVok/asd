# whereRaw()

Node.js command · Raw SQL

Adds a raw condition. `?` binds a value and `??` binds an identifier, and the difference decides whether the query works.

## Syntax

```js
.whereRaw('?? = ?', ['h.stars', 4])
```

## Example

```js
// Expression on the left side, value bound on the right.
await db('hotels').whereRaw('LOWER(name) LIKE ?', ['%view%']);

// Identifier binding. Without ?? MySQL compares the column to the text 'h.stars'.
await db('hotels as h').whereRaw('?? = ?', ['h.stars', 4]);

// Careful: the % stays a wildcard, so a user typing % matches everything.
const term = req.query.q ?? '';
const rows = await db('hotels').whereRaw('name like ?', [`%${term}%`]);

// Bound list, built from the array length.
await db('hotels').whereRaw('id in (?, ?, ?)', [1, 2, 3]);
```

## Details

The `%` and `_` characters inside user input stay wildcards even when bound. Escape them, or accept that a search term can match more than it should.

# result.insertId

Node.js command · Safety

The result object of a write. insertId is the generated key, affectedRows the number of rows changed.

## Syntax

```js
const [result] = await pool.execute(...)
```

## Example

```js
const [result] = await pool.execute(
    'INSERT INTO hotels (city, name, description, stars, owner_email) VALUES (?, ?, ?, ?, ?)',
    [city, name, description, stars, ownerEmail]
);

// 201 with the new key for a create
res.status(201).json({ id: result.insertId });

// 404 when an update or delete matched nothing
if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
```

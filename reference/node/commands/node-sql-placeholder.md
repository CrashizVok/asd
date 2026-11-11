# ? placeholder

Node.js command · Safety

Sends values separately from the statement so user text can never become SQL. The first step against injection.

## Syntax

```js
pool.execute(sql, [value1, value2])
```

## Example

```js
// Wrong: the request writes part of the statement
const badSql = `SELECT * FROM hotels WHERE city = '${req.query.city}'`;

// Right: the driver escapes and binds the value
const [rows] = await pool.execute(
    'SELECT * FROM hotels WHERE city = ?',
    [req.query.city]
);

// A column name cannot be bound. Whitelist it, then inline the safe name.
const sort = ['name', 'city', 'stars'].includes(req.query.sort) ? req.query.sort : 'name';
const [sorted] = await pool.query(`SELECT id, name FROM hotels ORDER BY ${sort}`);
```

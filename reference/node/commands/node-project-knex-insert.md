# .insert()

Node.js command · Writes

Inserts one row or an array of rows. Against MySQL it resolves to an array whose first item is the new auto increment id.

## Syntax

```js
db('hotels').insert(row)
```

## Example

```js
// POST /api/hotels
const row = {
    city: 'Pecs',
    name: 'Zsolnay Udvar',
    description: 'Rooms above the old factory.',
    stars: 4,
    owner_email: 'kovacs.anna@example.test',
};

const [id] = await db('hotels').insert(row);
response.status(201).json({ id, ...row });

// An array inserts several rows in one statement and returns the first id.
await db('customers').insert([
    { email: 'a@example.test', first_name: 'Anna', last_name: 'Kovacs', phone: '' },
    { email: 'b@example.test', first_name: 'Bela', last_name: 'Nagy', phone: '' },
]);
```

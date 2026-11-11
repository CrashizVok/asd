# .toSQL().toNative()

Node.js command · Debugging

Returns the SQL text and the bound values without running the query. Use it when a builder produces an unexpected where clause.

## Syntax

```js
query.toSQL().toNative()
```

## Example

```js
const query = db('hotels as h')
    .join('customers as c', 'c.email', 'h.owner_email')
    .where('h.city', 'Eger')
    .select({ id: 'h.id', owner: 'c.email' });

console.log(query.toSQL().toNative());
// Output, with identifier quotes left out for readability:
// {
//   sql: "select h.id as id, c.email as owner from hotels as h " +
//        "inner join customers as c on c.email = h.owner_email " +
//        "where h.city = ?",
//   bindings: [ 'Eger' ]
// }

// To watch every query while learning, pass debug: true to knex().
// Remove it before the exam demo: it prints passwords from inserts too.
```

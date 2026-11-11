# orderBy() with limit()

Node.js command · Queries

Sorts and pages the result. Offset and limit map to the MySQL `LIMIT m, n` clause.

## Syntax

```js
.orderBy(column, 'asc'|'desc').limit(n).offset(m)
```

## Example

```js
// First page of the cheapest hotels in one city.
const page1 = await db('hotels')
  .where('city', 'Budapest')
  .orderBy('stars', 'asc')
  .limit(10)
  .offset(0);

// Two keys, so ties on stars fall back to the name.
const ranked = await db('hotels').orderBy([
  { column: 'stars', order: 'desc' },
  { column: 'name', order: 'asc' },
]);

// Custom order, bound as values.
const byCity = await db('hotels').orderByRaw('FIELD(city, ?, ?)', ['Budapest', 'Eger']);
```

## Details

A column name from the query string must be checked against a whitelist before it reaches `orderBy`. Identifiers are not bindings, and quoting is not validation.

# Knex update

Node.js command · Knex

Updates matching rows and resolves with the affected row count. A missing where clause updates every row.

## Syntax

```js
await db('hotels').where(...).update(values)
```

## Example

```js
// File: src/update-hotel.js
import knex from "knex";

const db = knex({ client: "mysql2", connection: process.env.DATABASE_URL });

const affected = await db("hotels")
  .where({ hotel_id: 7 })
  .update({ stars: 5, city: "Budapest" });

console.log(affected); // 1, or 0 when nothing matched

// Always check the count before reporting success
if (affected === 0) {
  console.log("no hotel with id 7");
}

// An update without where changes the whole table
// await db("hotels").update({ city: "Budapest" }); // avoid
```

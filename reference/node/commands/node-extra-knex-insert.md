# Knex insert

Node.js command · Knex

Inserts one row or an array of rows. MySQL returns the new id as the first element of the result.

## Syntax

```js
await db('hotels').insert(row)
```

## Example

```js
// File: src/create-hotel.js
import knex from "knex";

const db = knex({ client: "mysql2", connection: process.env.DATABASE_URL });

// Column names must match the table, Knex does not map them
const [hotelId] = await db("hotels").insert({
  name: "Danube View",
  city: "Budapest",
  stars: 4,
  owner_email: "owner@example.com"
});

console.log(hotelId); // 12

// An array inserts several rows in one statement
await db("hotels").insert([
  { name: "City Loft", city: "Budapest", stars: 5 },
  { name: "Valley Inn", city: "Eger", stars: 3 }
]);

// Truncate is a schema operation and cannot be undone
```

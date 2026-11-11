# Knex join

Node.js command · Knex

Adds an inner join. Qualify column names once two tables share a name, and select explicitly to avoid collisions.

## Syntax

```js
db('hotels').join('owners', 'owners.owner_email', 'hotels.owner_email')
```

## Example

```js
// File: src/hotels-with-owner.js
import knex from "knex";

const db = knex({ client: "mysql2", connection: process.env.DATABASE_URL });

const rows = await db("hotels")
  .join("owners", "owners.owner_email", "hotels.owner_email")
  .select(
    "hotels.hotel_id",
    "hotels.name as hotel_name",
    "owners.first_name",
    "owners.last_name"
  )
  .where("hotels.city", "Budapest");

console.log(rows);
// [{ hotel_id: 1, hotel_name: "Danube View", first_name: "Anna", last_name: "Kovacs" }]

// leftJoin keeps hotels without an owner row
const all = await db("hotels")
  .leftJoin("owners", "owners.owner_email", "hotels.owner_email")
  .select("hotels.name", "owners.first_name");
```

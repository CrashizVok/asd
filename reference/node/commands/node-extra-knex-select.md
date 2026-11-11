# Knex select and where

Node.js command · Knex

Builds a SELECT query as a chain and returns a promise. Selecting columns by name keeps the payload small.

## Syntax

```js
db('hotels').select(...).where(...)
```

## Example

```js
// File: src/hotels.js
import knex from "knex";

const db = knex({ client: "mysql2", connection: process.env.DATABASE_URL });

// SELECT hotel_id, name, stars FROM hotels WHERE city = ? ORDER BY stars DESC LIMIT 10
const hotels = await db("hotels")
  .select("hotel_id", "name", "stars")
  .where("city", "Budapest")
  .orderBy("stars", "desc")
  .limit(10);

console.log(hotels.length);

// where with an object adds AND conditions
const one = await db("hotels").where({ hotel_id: 1 }).first();
console.log(one ? one.name : "missing");
```

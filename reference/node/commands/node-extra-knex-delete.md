# Knex delete

Node.js command · Knex

Deletes matching rows and resolves with the count. del is the method name because delete is a reserved word.

## Syntax

```js
await db('hotels').where(...).del()
```

## Example

```js
// File: src/delete-hotel.js
import knex from "knex";

const db = knex({ client: "mysql2", connection: process.env.DATABASE_URL });

const deleted = await db("hotels").where({ hotel_id: 7 }).del();
console.log(deleted); // 1

// Deleting an owner usually needs the hotels handled first
// when a foreign key points at owners(owner_email)
try {
  await db("owners").where({ owner_email: "owner@example.com" }).del();
} catch (error) {
  console.log(error.code); // "ER_ROW_IS_REFERENCED_2"
}

// Without where, every row is removed
// await db("hotels").del();
```

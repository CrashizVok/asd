# Knex transaction

Node.js command · Knex

Runs several statements as one unit. A thrown error rolls everything back, so a half written booking cannot survive.

## Syntax

```js
await db.transaction(async (trx) => { ... })
```

## Example

```js
// File: src/book.js
import knex from "knex";

const db = knex({ client: "mysql2", connection: process.env.DATABASE_URL });

export async function book(hotelId, email) {
  return db.transaction(async (trx) => {
    // The same trx object must be used for every statement
    const hotel = await trx("hotels").where({ hotel_id: hotelId }).first();

    if (!hotel) {
      throw new Error("Hotel not found"); // rollback, nothing is written
    }

    const [bookingId] = await trx("bookings").insert({
      hotel_id: hotelId,
      customer_email: email,
      adults: 2,
      children: 0
    });

    return bookingId;
  });
}
```

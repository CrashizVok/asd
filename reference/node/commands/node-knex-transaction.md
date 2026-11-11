# db.transaction()

Node.js command · Transactions

Runs statements on one connection as a unit. Resolving commits, throwing rolls back.

## Syntax

```js
await db.transaction(async (trx) => { ... })
```

## Example

```js
export async function book({ email, hotelId, start, end }) {
  return db.transaction(async (trx) => {
    // forUpdate locks the row until this transaction ends.
    const hotel = await trx('hotels').where('id', hotelId).forUpdate().first();
    if (!hotel) throw Object.assign(new Error('Hotel not found'), { status: 404 });

    const clash = await trx('bookings')
      .where('hotel_id', hotelId)
      .where('start_date', '<', end)
      .where('end_date', '>', start)
      .first();
    if (clash) throw Object.assign(new Error('Dates taken'), { status: 409 });

    await trx('bookings').insert({
      customer_email: email,
      hotel_id: hotelId,
      start_date: start,
      end_date: end,
      adults: 1,
      children: 0,
      boylovers: 0,
    });

    return trx('bookings').where({ customer_email: email, hotel_id: hotelId }).first();
  });
}
```

## Details

Using `db(...)` inside the callback runs on a different socket, outside the transaction, so a rollback leaves that write in place. Every statement inside must use `trx`. A deadlock (`ER_LOCK_DEADLOCK`) is safe to retry once, from outside the callback.

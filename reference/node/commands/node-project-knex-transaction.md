# db.transaction()

Node.js command · Transactions

Runs several statements on one connection and commits when the callback resolves. A thrown error rolls everything back.

## Syntax

```js
db.transaction(async (trx) => { ... })
```

## Example

```js
// Create an owner and their first hotel, or neither.
await db.transaction(async (trx) => {
    await trx('customers').insert({
        email,
        first_name: firstName,
        last_name: lastName,
        phone: '',
    });

    const [hotelId] = await trx('hotels').insert({
        city,
        name,
        description: '',
        stars: 3,
        owner_email: email,
    });

    return hotelId;
});

// Wrong: db writes on another pooled connection, outside the transaction,
// and stays behind when the callback throws. Use trx inside the callback.
```

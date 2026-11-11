# START TRANSACTION

Node.js command · Writing

Groups statements so they all land or none do. In Node the whole transaction must run on one pooled connection.

## Syntax

```js
START TRANSACTION; ... COMMIT; | ROLLBACK;
```

## Example

```js
START TRANSACTION;
INSERT INTO customers (email, first_name, last_name)
VALUES ('eva.molnar@example.com', 'Eva', 'Molnar');
INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults)
VALUES ('eva.molnar@example.com', 2, '2025-10-01', '2025-10-03', 1);
COMMIT;
```

## Details

`pool.query` takes a connection per call, so three calls are not a transaction. Take one connection and release it in `finally`:

```js
const conn = await pool.getConnection();
try {
    await conn.beginTransaction();
    await conn.execute('INSERT INTO customers (email, first_name, last_name) VALUES (?, ?, ?)', [email, first, last]);
    await conn.execute('INSERT INTO bookings (customer_email, hotel_id, start_date, end_date) VALUES (?, ?, ?, ?)', [email, hotelId, start, end]);
    await conn.commit();
    res.status(201).json({ email });
} catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') res.status(409).json({ error: 'Already exists' });
    else res.status(500).json({ error: 'Insert failed' });
} finally {
    conn.release();
}
```

A missing `release` empties the pool after enough failed requests, and every later route hangs.


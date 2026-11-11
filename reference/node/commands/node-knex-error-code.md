# err.code

Node.js command · Errors

mysql2 puts a stable MySQL error code on the error object. Branch on the code, because the message text changes between versions and languages.

## Syntax

```js
if (error.code === 'ER_DUP_ENTRY') { ... }
```

## Example

```js
// Codes worth knowing in the bookings exam:
// ER_DUP_ENTRY             duplicate primary or unique key
// ER_NO_REFERENCED_ROW_2   insert points at a row that does not exist
// ER_ROW_IS_REFERENCED_2   delete blocked by a foreign key
// ER_DATA_TOO_LONG         value longer than the column
// ER_TRUNCATED_WRONG_VALUE bad date or number format
// ER_LOCK_DEADLOCK         transaction chosen as a deadlock victim
// ER_ACCESS_DENIED_ERROR   wrong user or password
// ER_BAD_DB_ERROR          database does not exist
// ECONNREFUSED             nothing listening on that host and port

const STATUS = {
  ER_DUP_ENTRY: 409,
  ER_NO_REFERENCED_ROW_2: 400,
  ER_ROW_IS_REFERENCED_2: 409,
  ER_DATA_TOO_LONG: 400,
  ER_TRUNCATED_WRONG_VALUE: 400,
  ER_LOCK_DEADLOCK: 503,
};

try {
  await db('customers').insert({
    email: 'anna.kovacs@example.com',
    first_name: 'Anna',
    last_name: 'Kovacs',
  });
} catch (error) {
  const status = STATUS[error.code] ?? 500;
  // Log the detail, answer with a sentence. sqlMessage names tables.
  console.error({ code: error.code, sql: error.sql, message: error.message });
  res.status(status).json({ error: status === 409 ? 'Already exists' : 'Cannot save' });
}
```

## Details

Knex adds `error.sql` and `error.bindings` to driver errors. Log them on the server only. `sqlMessage` is a schema map for anyone who can read the response.

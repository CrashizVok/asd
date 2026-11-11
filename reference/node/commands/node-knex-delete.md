# del()

Node.js command · Writes

Deletes the selected rows and resolves to how many were removed. `truncate()` is the fast, unrollbackable alternative.

## Syntax

```js
.where(...).del()
```

## Example

```js
const removed = await db('bookings')
  .where({ customer_email: 'ben.nagy@example.com', hotel_id: 1 })
  .del();
console.log(removed); // 1

// A hotel that still has bookings raises ER_ROW_IS_REFERENCED_2,
// because the foreign key is ON DELETE RESTRICT.
try {
  await db('hotels').where('id', 1).del();
} catch (error) {
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    console.log('Delete the bookings first.');
  }
}

// Empty the table and reset the auto increment. DDL, so no rollback.
await db('hotels').truncate();
```

## Details

`del()` with no `where` deletes every row and reports no error. Guard the route, and keep `truncate()` for seeds and tests.

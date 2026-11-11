# onConflict()

Node.js command · Writes

Turns an insert into MySQL's upsert: `ON DUPLICATE KEY UPDATE` for merge, `INSERT IGNORE` for ignore.

## Syntax

```js
.onConflict().merge([columns]) | .onConflict().ignore()
```

## Example

```js
// One guest books one hotel once, so the primary key is
// (customer_email, hotel_id). A repeated POST moves the dates.
await db('bookings')
  .insert({
    customer_email: 'ben.nagy@example.com',
    hotel_id: 1,
    start_date: '2025-09-01',
    end_date: '2025-09-04',
    adults: 2,
    children: 0,
    boylovers: 0,
  })
  .onConflict()
  .merge(['start_date', 'end_date', 'adults', 'children', 'boylovers']);

// Insert or do nothing. Useful for a seed that may run twice.
await db('customers')
  .insert({ email: 'cara.szabo@example.com', first_name: 'Cara', last_name: 'Szabo' })
  .onConflict()
  .ignore();
```

## Details

MySQL ignores the column list you pass, because `ON DUPLICATE KEY` fires on any unique key of the table. Know which keys exist before you rely on it. `merge()` with no column list updates every inserted column.

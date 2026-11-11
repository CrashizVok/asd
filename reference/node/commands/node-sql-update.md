# UPDATE

Node.js command · Writing

Changes the matched rows. Without WHERE it changes every row, so run the condition as a SELECT first.

## Syntax

```js
UPDATE table SET column = value WHERE condition
```

## Example

```js
-- Change one booking. The key is the pair, so the WHERE has both.
UPDATE bookings
SET start_date = '2025-09-02',
    end_date   = '2025-09-04',
    adults     = 3
WHERE customer_email = 'dora.toth@example.com'
  AND hotel_id = 1;

-- Count what the WHERE matches before the write
SELECT COUNT(*) FROM bookings WHERE hotel_id = 1;
```

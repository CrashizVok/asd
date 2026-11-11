# COALESCE()

Node.js command · Grouping

Returns the first argument that is not NULL. Converts a NULL total into 0 and keeps a partial UPDATE from erasing a column.

## Syntax

```js
COALESCE(value, fallback)
```

## Example

```js
-- JSON gets 0, not null, when nothing matches
SELECT COALESCE(SUM(adults), 0) AS adults FROM bookings
WHERE start_date <= '2025-07-31' AND end_date >= '2025-07-01';

-- Keep the old value when the new one is NULL
UPDATE bookings
SET adults = COALESCE(?, adults),
    children = COALESCE(?, children)
WHERE customer_email = ? AND hotel_id = ?;
```

# ON DUPLICATE KEY UPDATE

Node.js command · Writing

Insert, or update the existing row when a primary or unique key collides. One statement instead of a check and a race.

## Syntax

```js
INSERT ... ON DUPLICATE KEY UPDATE column = VALUES(column)
```

## Example

```js
-- A guest books a hotel once: the key is (customer_email, hotel_id)
INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults)
VALUES (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    start_date = VALUES(start_date),
    end_date   = VALUES(end_date),
    adults     = VALUES(adults);

-- affectedRows: 1 inserted, 2 updated, 0 unchanged
```

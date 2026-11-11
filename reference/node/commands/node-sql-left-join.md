# LEFT JOIN

Node.js command · Joins

Keeps every row of the left table and fills the right side with NULL where nothing matches. Use it when a zero must still appear.

## Syntax

```js
FROM a LEFT JOIN b ON b.key = a.key
```

## Example

```js
-- Every hotel, with the number of bookings. COUNT(column)
-- skips NULL, so a hotel with none counts 0.
SELECT h.id, h.name, COUNT(b.customer_email) AS bookings
FROM hotels h
LEFT JOIN bookings b ON b.hotel_id = h.id
GROUP BY h.id, h.name
ORDER BY bookings DESC, h.name;
```

## Details

A filter on the right table in `WHERE` turns the outer join back into an inner one, because `NULL >= '2025-01-01'` is unknown. Put that condition in `ON`:

```sql
SELECT h.id, h.name, b.start_date
FROM hotels h
LEFT JOIN bookings b
       ON b.hotel_id = h.id
      AND b.start_date >= '2025-01-01'
      AND b.start_date <  '2026-01-01';
```

Also, `COUNT(*)` would count the NULL padded row and report 1 booking for a hotel with none. Count a column from the right table instead.


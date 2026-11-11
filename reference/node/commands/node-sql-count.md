# COUNT()

Node.js command · Grouping

COUNT(*) counts rows, COUNT(column) skips NULLs, COUNT(DISTINCT column) counts different non-null values.

## Syntax

```js
COUNT(*) | COUNT(column) | COUNT(DISTINCT column)
```

## Example

```js
-- Rows, distinct guests, and guests with a phone
SELECT COUNT(*)                  AS bookings,
       COUNT(DISTINCT customer_email) AS guests
FROM bookings;

-- With a left join, count the right table column so zero stays zero
SELECT h.name, COUNT(b.customer_email) AS bookings
FROM hotels h
LEFT JOIN bookings b ON b.hotel_id = h.id
GROUP BY h.id, h.name;
```

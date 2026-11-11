# ORDER BY

Node.js command · Sorting

Sorts the result. Reads keys left to right, ASC by default. Add a unique tiebreaker when the sort key repeats.

## Syntax

```js
ORDER BY column [ASC|DESC], column2 [ASC|DESC]
```

## Example

```js
-- Highest stars first, names A to Z inside equal stars
SELECT id, name, stars FROM hotels
ORDER BY stars DESC, name ASC, id ASC;

-- Sort by an expression: longest stay first
SELECT customer_email, hotel_id,
       DATEDIFF(end_date, start_date) AS nights
FROM bookings
ORDER BY nights DESC, start_date ASC;
```

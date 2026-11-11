# LIMIT / OFFSET

Node.js command · Sorting

Cuts the result to count rows after sorting. Without ORDER BY the rows are arbitrary, not the first ones.

## Syntax

```js
LIMIT count [OFFSET start]
```

## Example

```js
-- Page 3 of a ten row list, with a stable tiebreaker
SELECT id, name, city FROM hotels
ORDER BY name, id
LIMIT 10 OFFSET 20;

-- Longest booking, exactly one row
SELECT customer_email, hotel_id, start_date, end_date
FROM bookings
ORDER BY DATEDIFF(end_date, start_date) DESC, start_date ASC
LIMIT 1;
```

## Details

In a route, a limit from `req.query` arrives as a string. `pool.query` quotes it into `LIMIT '10'` and MySQL rejects the syntax. Either use `pool.execute` and bind `?`, or parse it to a positive integer, cap it, and inline the number.


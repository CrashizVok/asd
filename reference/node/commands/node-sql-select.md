# SELECT

Node.js command · Reading

Chooses the columns the query returns. List them instead of using *, so the JSON shape matches the frontend.

## Syntax

```js
SELECT column_list FROM table
```

## Example

```js
-- One row per hotel, four named columns
SELECT id, city, name, stars
FROM hotels;

-- Aliases become the JSON keys the frontend reads
SELECT name AS hotel_name, DATEDIFF(end_date, start_date) AS nights
FROM bookings;
```

## Details

The clause order you write is not the order MySQL runs. `FROM` and the joins build rows, `WHERE` filters them, `GROUP BY` folds them, `HAVING` filters groups, then `SELECT` computes the output. A `SELECT` alias therefore works in `ORDER BY` and fails in `WHERE`.

`SELECT *` sends every column, including ones the page has no slot for, and it breaks quietly when a column is added. Name the columns.


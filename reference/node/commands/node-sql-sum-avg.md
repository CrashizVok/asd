# SUM() / AVG()

Node.js command · Grouping

Adds or averages the non-null values of a group. Returns NULL when no row qualifies, so wrap totals in COALESCE.

## Syntax

```js
SUM(expression) | AVG(expression)
```

## Example

```js
-- Guest totals for the whole table: one row, zero when empty
SELECT COALESCE(SUM(adults), 0)   AS adults,
       COALESCE(SUM(children), 0) AS children,
       COALESCE(SUM(adults + children + boylovers), 0) AS guests
FROM bookings;

-- Average stars per city, ignoring cities with no row
SELECT city, ROUND(AVG(stars), 2) AS avg_stars
FROM hotels
GROUP BY city;
```

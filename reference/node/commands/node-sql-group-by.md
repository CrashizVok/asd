# GROUP BY

Node.js command · Grouping

Folds rows that share values into one row per group. Every selected column must be grouped or aggregated.

## Syntax

```js
SELECT key, AGG(...) FROM table GROUP BY key
```

## Example

```js
-- Hotels per city, with the average star rating
SELECT city,
       COUNT(*) AS hotels,
       AVG(stars) AS avg_stars
FROM hotels
GROUP BY city
ORDER BY hotels DESC, city;

-- Yearly booking counts from the start date
SELECT YEAR(start_date) AS booking_year, COUNT(*) AS bookings
FROM bookings
GROUP BY YEAR(start_date)
ORDER BY booking_year;
```

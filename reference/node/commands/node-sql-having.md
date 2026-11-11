# HAVING

Node.js command · Grouping

Filters groups after the aggregates are computed. The only place to put a condition on COUNT, SUM or AVG.

## Syntax

```js
GROUP BY key HAVING aggregate_condition
```

## Example

```js
-- Cities that own more than one hotel
SELECT city, COUNT(*) AS hotels
FROM hotels
GROUP BY city
HAVING COUNT(*) > 1
ORDER BY city;

-- Row filter in WHERE, group filter in HAVING
SELECT city, COUNT(*) AS four_star
FROM hotels
WHERE stars = 4
GROUP BY city
HAVING COUNT(*) > 1;
```

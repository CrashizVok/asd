# WHERE

Node.js command · Filtering

Keeps only the rows where the condition is true. Runs before grouping, so it can use columns but not COUNT or SUM.

## Syntax

```js
SELECT ... FROM table WHERE condition
```

## Example

```js
-- Hotels with at least four stars in one city
SELECT id, name, stars
FROM hotels
WHERE city = 'Budapest' AND stars >= 4;

-- NULL never matches =; use IS NULL
SELECT email, first_name FROM customers WHERE phone IS NULL;
```

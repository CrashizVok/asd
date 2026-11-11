# BETWEEN

Node.js command · Filtering

Inclusive range, both ends included. Works on numbers and on dates in YYYY-MM-DD form.

## Syntax

```js
WHERE column BETWEEN low AND high
```

## Example

```js
-- Stars from 3 to 5, both ends counted
SELECT id, name, stars FROM hotels
WHERE stars BETWEEN 3 AND 5;

-- Dates: a booking starting on the 31st is inside the range
SELECT customer_email, start_date FROM bookings
WHERE start_date BETWEEN '2025-07-01' AND '2025-07-31';
```

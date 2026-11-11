# DATEDIFF() / YEAR()

Node.js command · Dates

Whole days from the second date to the first. DATEDIFF(end_date, start_date) is the number of nights in a booking.

## Syntax

```js
DATEDIFF(later, earlier)
```

## Example

```js
-- Nights per booking, longest first
SELECT customer_email, hotel_id, start_date, end_date,
       DATEDIFF(end_date, start_date) AS nights
FROM bookings
ORDER BY nights DESC, start_date ASC;

-- Calendar parts and a month label
SELECT YEAR(start_date) AS y, MONTH(start_date) AS m,
       DATE_FORMAT(start_date, '%Y-%m') AS month_label
FROM bookings;

SELECT CURDATE();                              -- today
SELECT DATE_ADD('2025-07-01', INTERVAL 7 DAY);  -- 2025-07-08
```

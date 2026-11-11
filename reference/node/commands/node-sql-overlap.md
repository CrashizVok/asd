# date range overlap

Node.js command · Dates

Selects rows whose date range touches the requested period. Both comparisons are needed; either one alone is wrong.

## Syntax

```js
WHERE start_date <= :to AND end_date >= :from
```

## Example

```js
-- Stays that touch July 2025. A stay ending on the 1st is included,
-- and so is one starting on the 31st.
SELECT customer_email, hotel_id, start_date, end_date
FROM bookings
WHERE start_date <= '2025-07-31'
  AND end_date   >= '2025-07-01';

-- Guest totals for the same period, one row back
SELECT COALESCE(SUM(adults), 0)   AS adults,
       COALESCE(SUM(children), 0) AS children
FROM bookings
WHERE start_date <= ? AND end_date >= ?;
```

## Details

The strict form, for "which room is free for the night of the 10th", uses `start_date <= date AND end_date > date`, because a guest who checks out on the 10th frees the room. Pick one rule, write it in a comment, and test the boundary where a stay ends exactly on the arrival date.


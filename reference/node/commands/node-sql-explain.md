# EXPLAIN

Node.js command · Schema

Prints the query plan instead of running the query. Check type and rows to see whether an index did the work.

## Syntax

```js
EXPLAIN SELECT ...
```

## Example

```js
EXPLAIN SELECT * FROM bookings WHERE hotel_id = 1;

-- type = ALL means a full table scan.
-- type = ref or range means an index was used.
-- key shows which index, rows estimates the work.
```

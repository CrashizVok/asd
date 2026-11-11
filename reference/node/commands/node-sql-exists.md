# EXISTS / NOT EXISTS

Node.js command · Reading

Tests whether the subquery returns at least one row. Stops at the first match and stays correct when NULLs are involved.

## Syntax

```js
WHERE EXISTS (SELECT 1 FROM other WHERE ...)
```

## Example

```js
-- Hotels that have at least one booking
SELECT h.id, h.name
FROM hotels h
WHERE EXISTS (SELECT 1 FROM bookings b WHERE b.hotel_id = h.id);

-- Hotels with no booking at all. Safer than NOT IN, which breaks
-- when the subquery returns NULL.
SELECT h.id, h.name
FROM hotels h
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.hotel_id = h.id);
```

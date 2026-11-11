# IN ()

Node.js command · Filtering

Matches any value in the list. Shorter than a chain of ORs and easier to build from a filter array.

## Syntax

```js
WHERE column IN (value1, value2, ...)
```

## Example

```js
-- Three named cities
SELECT id, name, city FROM hotels
WHERE city IN ('Budapest', 'Debrecen', 'Eger');

-- NOT IN is unsafe when the subquery can return NULL: one NULL
-- makes every comparison unknown and the result empty.
SELECT id, name FROM hotels
WHERE id NOT IN (SELECT hotel_id FROM bookings WHERE hotel_id IS NOT NULL);
```

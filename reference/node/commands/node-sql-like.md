# LIKE

Node.js command · Filtering

Pattern match where % means any run of characters and _ means exactly one. The exam search box is built on it.

## Syntax

```js
WHERE column LIKE 'pattern'
```

## Example

```js
-- Contains "view", case insensitive on this schema
SELECT id, name FROM hotels WHERE name LIKE '%view%';

-- Search across two tables. The pattern is bound, not concatenated.
SELECT b.customer_email, c.first_name, h.name
FROM bookings b
JOIN customers c ON c.email = b.customer_email
JOIN hotels h    ON h.id = b.hotel_id
WHERE c.first_name LIKE CONCAT('%', ?, '%')
   OR c.last_name  LIKE CONCAT('%', ?, '%')
   OR h.name       LIKE CONCAT('%', ?, '%');
```

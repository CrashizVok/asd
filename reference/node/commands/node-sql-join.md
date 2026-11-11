# JOIN

Node.js command · Joins

Inner join: keeps only the rows that find a partner on the other side. JOIN alone means INNER JOIN.

## Syntax

```js
FROM a JOIN b ON b.key = a.key
```

## Example

```js
-- Every hotel with its owner's name
SELECT h.id, h.name, h.city, c.first_name, c.last_name
FROM hotels h
JOIN customers c ON c.email = h.owner_email
ORDER BY h.name, h.id;

-- A booking needs two joins: the guest and the hotel
SELECT b.customer_email, c.last_name, h.name AS hotel_name, b.start_date
FROM bookings b
JOIN customers c ON c.email = b.customer_email
JOIN hotels h    ON h.id = b.hotel_id;
```

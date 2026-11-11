# DELETE

Node.js command · Writing

Removes the matched rows and returns affectedRows. Deleting a parent row may cascade or be refused by a foreign key.

## Syntax

```js
DELETE FROM table WHERE condition
```

## Example

```js
-- One booking, addressed by the composite key
DELETE FROM bookings
WHERE customer_email = 'dora.toth@example.com'
  AND hotel_id = 1;

-- A guest is removed together with their bookings (ON DELETE CASCADE),
-- but a guest who owns a hotel is refused (ON DELETE RESTRICT)
DELETE FROM customers WHERE email = 'dora.toth@example.com';
```

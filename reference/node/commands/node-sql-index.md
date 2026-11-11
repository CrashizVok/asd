# CREATE INDEX

Node.js command · Schema

Speeds up filters, joins and sorts on the indexed columns. Costs space and a little write time on every insert.

## Syntax

```js
CREATE INDEX name ON table (column[, column2])
```

## Example

```js
-- The primary key already covers (customer_email, hotel_id).
-- These cover the other directions and the date range filter.
CREATE INDEX idx_bookings_hotel ON bookings (hotel_id);
CREATE INDEX idx_bookings_dates ON bookings (start_date, end_date);
CREATE INDEX idx_hotels_owner   ON hotels (owner_email);

-- Composite index: usable for hotel_id alone, or hotel_id plus a date,
-- but not for start_date alone, because that column is not leftmost.
CREATE INDEX idx_bookings_hotel_date ON bookings (hotel_id, start_date);
```

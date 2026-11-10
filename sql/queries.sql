-- Queries for the bookings exam, in the order you usually need them.
-- Run after schema.sql: mysql -u root -p bookings < sql/queries.sql

USE bookings;

-- 1. All hotels with the owner's name and image.
SELECT
    h.id,
    h.city,
    h.name,
    h.description,
    h.stars,
    h.image AS hotel_image,
    h.owner_email,
    c.first_name,
    c.last_name,
    c.image AS owner_image
FROM hotels h
JOIN customers c ON c.email = h.owner_email
ORDER BY h.name ASC;

-- 2. All bookings of one hotel, oldest first.
SELECT
    b.customer_email,
    b.hotel_id,
    b.start_date,
    b.end_date,
    b.adults,
    b.children,
    b.boylovers,
    c.first_name,
    c.last_name,
    c.image AS customer_image
FROM bookings b
JOIN customers c ON c.email = b.customer_email
WHERE b.hotel_id = 1
ORDER BY b.start_date ASC;

-- 3. Search in guest names, hotel names, and hotel descriptions.
-- The API binds the same pattern five times.
SET @word = 'Anna';
SELECT
    b.customer_email,
    c.first_name,
    c.last_name,
    c.image AS customer_image,
    b.hotel_id,
    h.name,
    b.start_date,
    b.end_date,
    b.adults,
    b.children,
    b.boylovers
FROM bookings b
JOIN customers c ON c.email = b.customer_email
JOIN hotels h ON h.id = b.hotel_id
WHERE c.first_name LIKE CONCAT('%', @word, '%')
   OR c.last_name LIKE CONCAT('%', @word, '%')
   OR CONCAT(c.first_name, ' ', c.last_name) LIKE CONCAT('%', @word, '%')
   OR h.name LIKE CONCAT('%', @word, '%')
   OR h.description LIKE CONCAT('%', @word, '%')
ORDER BY b.start_date ASC;

-- 4. Guest totals for bookings that overlap a date range.
-- Overlap means: starts on or before the range end, ends on or after the range start.
SET @from_date = '2025-07-01';
SET @to_date = '2025-07-31';
SELECT
    COALESCE(SUM(adults), 0) AS adults,
    COALESCE(SUM(children), 0) AS children,
    COALESCE(SUM(boylovers), 0) AS boylovers
FROM bookings
WHERE start_date <= @to_date
  AND end_date >= @from_date;

-- 5. Number of bookings per year, sorted by year.
-- YEAR() on the start date is the usual exam rule.
SELECT
    YEAR(start_date) AS booking_year,
    COUNT(*) AS booking_count
FROM bookings
GROUP BY YEAR(start_date)
ORDER BY booking_year ASC;

-- 6. Longest booking in nights.
SELECT
    customer_email,
    hotel_id,
    start_date,
    end_date,
    DATEDIFF(end_date, start_date) AS nights
FROM bookings
ORDER BY nights DESC
LIMIT 1;

-- 7. Guest count per hotel, including hotels with no bookings.
SELECT
    h.id,
    h.name,
    COUNT(b.customer_email) AS bookings,
    COALESCE(SUM(b.adults + b.children + b.boylovers), 0) AS guests
FROM hotels h
LEFT JOIN bookings b ON b.hotel_id = h.id
GROUP BY h.id, h.name
ORDER BY guests DESC;

-- 8. Insert a customer. The API does the same with placeholders.
INSERT INTO customers (email, first_name, last_name, phone, birthday, image)
VALUES ('dora.toth@example.com', 'Dora', 'Toth', '+36 30 444 4444', '1995-09-09', NULL);

-- 9. Insert a booking. The pair (customer_email, hotel_id) must be new.
INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults, children, boylovers)
VALUES ('dora.toth@example.com', 1, '2025-09-01', '2025-09-04', 2, 0, 0);

-- 10. Partial update with COALESCE. Pass NULL to keep the old value.
-- The API builds the SET list from the fields that are present instead.
UPDATE bookings
SET
    start_date = COALESCE('2025-09-02', start_date),
    end_date = COALESCE(NULL, end_date),
    adults = COALESCE(3, adults),
    children = COALESCE(NULL, children),
    boylovers = COALESCE(NULL, boylovers)
WHERE customer_email = 'dora.toth@example.com'
  AND hotel_id = 1;

-- 11. Delete one booking.
DELETE FROM bookings
WHERE customer_email = 'dora.toth@example.com'
  AND hotel_id = 1;

-- 12. Delete a customer and the bookings that belong to them.
-- The foreign key uses ON DELETE CASCADE, so the second statement is enough.
DELETE FROM customers WHERE email = 'dora.toth@example.com';

-- 13. Transaction: a customer and a booking either both land or neither does.
START TRANSACTION;
INSERT INTO customers (email, first_name, last_name)
VALUES ('eva.molnar@example.com', 'Eva', 'Molnar');
INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults, children, boylovers)
VALUES ('eva.molnar@example.com', 2, '2025-10-01', '2025-10-03', 1, 0, 0);
COMMIT;

-- 14. Indexes for the common filters. The primary key already covers
-- customer_email + hotel_id, so these help the other directions.
CREATE INDEX idx_bookings_hotel ON bookings (hotel_id);
CREATE INDEX idx_bookings_dates ON bookings (start_date, end_date);
CREATE INDEX idx_hotels_owner ON hotels (owner_email);

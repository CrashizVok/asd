# SQL cheatsheet (MySQL)

Compact reference for the exam. Read the query, then read the result.

## SELECT and clause order
```sql
SELECT name, price FROM rooms
WHERE price < 100
GROUP BY name HAVING COUNT(*) > 1
ORDER BY price DESC LIMIT 10;
```
The engine runs FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. So a SELECT alias works in ORDER BY but not in WHERE.

## WHERE
```sql
SELECT * FROM rooms WHERE city = 'Split';
SELECT * FROM rooms WHERE price BETWEEN 50 AND 120;
SELECT * FROM rooms WHERE city IN ('Split', 'Zagreb');
SELECT * FROM rooms WHERE name LIKE 'Sea%';
SELECT * FROM rooms WHERE price > 100 AND free_cancel = 1;
```
`%` matches any run of characters, `_` exactly one. `AND` binds tighter than `OR`, so use parentheses: `WHERE (a = 1 OR b = 2) AND c = 3`.

## ORDER BY and LIMIT
```sql
SELECT * FROM rooms ORDER BY price DESC;
SELECT * FROM rooms ORDER BY city, price DESC;
SELECT * FROM rooms ORDER BY id LIMIT 10 OFFSET 20;
```
Without ORDER BY the row order is undefined. Add a tiebreaker (`id`) when paginating, or pages repeat and skip rows.

## Joins
```sql
-- INNER: only rows that match on both sides
SELECT b.id, r.name FROM bookings b JOIN rooms r ON r.id = b.room_id;

-- LEFT: keep every booking, nulls where the room is missing
SELECT b.id, r.name FROM bookings b LEFT JOIN rooms r ON r.id = b.room_id;

-- left rows with no match at all
SELECT b.id FROM bookings b LEFT JOIN rooms r ON r.id = b.room_id WHERE r.id IS NULL;
```
`JOIN` alone means `INNER JOIN`. A `LEFT JOIN` filtered in `WHERE` on the right table acts like an inner join; put that condition in `ON` to keep the left rows.

## GROUP BY and HAVING
```sql
SELECT city, COUNT(*) AS rooms, AVG(price) AS avg_price
FROM rooms GROUP BY city;

SELECT city, COUNT(*) AS rooms FROM rooms
GROUP BY city HAVING COUNT(*) > 2;
```
Every selected column must be aggregated or in GROUP BY. `WHERE` filters rows before grouping; `HAVING` filters groups after.

## Aggregate functions
```sql
COUNT(*)               -- rows
COUNT(DISTINCT city)   -- distinct values, nulls skipped
SUM(price), AVG(price)
MIN(price), MAX(price)
GROUP_CONCAT(name SEPARATOR ', ')
```
`COUNT(column)` skips nulls, `COUNT(*)` does not. `AVG` also skips nulls; `AVG(COALESCE(price, 0))` counts them as zero.

## Subqueries
```sql
SELECT * FROM rooms WHERE price > (SELECT AVG(price) FROM rooms);

SELECT * FROM rooms
WHERE id IN (SELECT room_id FROM bookings WHERE checkin = '2026-11-10');

-- derived table, needs an alias
SELECT city, avg_price FROM
  (SELECT city, AVG(price) AS avg_price FROM rooms GROUP BY city) AS stats
WHERE avg_price > 90;
```

## EXISTS
```sql
SELECT r.* FROM rooms r
WHERE EXISTS (SELECT 1 FROM bookings b WHERE b.room_id = r.id);

SELECT r.* FROM rooms r
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.room_id = r.id);
```
`EXISTS` stops at the first match, often faster than `IN` on a large subquery, and it handles nulls safely where `NOT IN` does not.

## CASE
```sql
SELECT name,
  CASE WHEN price < 60 THEN 'budget'
       WHEN price < 120 THEN 'standard'
       ELSE 'premium' END AS band
FROM rooms;

SELECT SUM(CASE WHEN free_cancel = 1 THEN 1 ELSE 0 END) AS free_count FROM rooms;
```
`CASE` returns the first matching branch. Without `ELSE` the result is `NULL`.

## NULL handling
```sql
SELECT * FROM rooms WHERE discount IS NULL;
SELECT * FROM rooms WHERE discount IS NOT NULL;
SELECT COALESCE(discount, 0) FROM rooms;
SELECT IFNULL(discount, 0) FROM rooms;
SELECT NULLIF(price, 0) FROM rooms;   -- null when price is 0
```
`= NULL` is never true. Arithmetic with `NULL` gives `NULL`. `COUNT`, `SUM` and `AVG` skip nulls. `COALESCE` returns the first non-null argument.

## INSERT, UPDATE, DELETE
```sql
INSERT INTO rooms (name, city, price) VALUES ('Sea view', 'Split', 80);
INSERT INTO rooms (name, city, price)
  VALUES ('City single', 'Budapest', 55), ('Family suite', 'Split', 140);
UPDATE rooms SET price = 90 WHERE id = 3;
UPDATE rooms SET price = price * 1.1 WHERE city = 'Split';
DELETE FROM rooms WHERE id = 3;
```
Run the `WHERE` as a `SELECT` first. An `UPDATE` or `DELETE` without `WHERE` hits every row.

## CREATE TABLE
```sql
CREATE TABLE rooms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  city VARCHAR(80) NOT NULL,
  price DECIMAL(8,2) NOT NULL CHECK (price >= 0),
  free_cancel TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;
```
`VARCHAR(n)` holds up to n characters. `DECIMAL` is exact, which matters for money. `TINYINT(1)` is the usual boolean.

## Primary and foreign keys
```sql
CREATE TABLE bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id INT UNSIGNED NOT NULL,
  checkin DATE NOT NULL,
  checkout DATE NOT NULL,
  CONSTRAINT fk_bookings_room
    FOREIGN KEY (room_id) REFERENCES rooms(id)
    ON DELETE CASCADE
);
```
A primary key is unique and not null, one per table. A foreign key points at a primary key elsewhere. `ON DELETE CASCADE` removes children with the parent; `RESTRICT` refuses the delete.

## Indexes
```sql
CREATE INDEX idx_rooms_city ON rooms (city);
CREATE UNIQUE INDEX uq_guest ON bookings (guest_email, checkin);
DROP INDEX idx_rooms_city ON rooms;
```
An index speeds up reads and slows down writes. Column order in a composite index matters; the leftmost column works alone. Primary and unique keys are indexed already.

## Transactions
```sql
START TRANSACTION;
UPDATE rooms SET price = price + 10 WHERE id = 1;
INSERT INTO audit (msg) VALUES ('price raised');
COMMIT;   -- ROLLBACK; undoes everything since START
```
All changes land together or not at all. InnoDB only. Keep transactions short, because they hold locks.

## Date functions
```sql
CURDATE()                        -- 2026-11-10
NOW(), DATE_FORMAT(checkin, '%Y-%m-%d')
DATE_ADD(checkin, INTERVAL 3 DAY)
DATE_SUB(checkin, INTERVAL 1 MONTH)
DATEDIFF(checkout, checkin)      -- whole days between
YEAR(checkin), MONTH(checkin), DAY(checkin)
STR_TO_DATE('10/11/2026', '%d/%m/%Y')
```

## String functions
```sql
CONCAT(first_name, ' ', last_name)
CONCAT_WS(', ', city, country)
UPPER(name), LOWER(name)
TRIM(name), LTRIM(name), RTRIM(name)
SUBSTRING(name, 1, 3)
REPLACE(name, 'Sea', 'Ocean')
LOCATE('view', name)  -- 1 based, 0 when absent
LPAD(id, 5, '0')
```

## Date overlap query
Two ranges overlap when each starts before the other ends. This lists rooms free for a stay.
```sql
SELECT r.* FROM rooms r
WHERE NOT EXISTS (
  SELECT 1 FROM bookings b
  WHERE b.room_id = r.id
    AND b.checkin < '2026-11-15'
    AND b.checkout > '2026-11-10'
);
```
The strict `<` and `>` let one booking end on the day the next begins. Reversing either comparison gives wrong answers, so test a booking that ends exactly on the arrival date.

## Odds and ends
- `SELECT DISTINCT city FROM rooms;` removes duplicate rows.
- `SHOW TABLES;` and `DESCRIBE rooms;` inspect a database.
- `TRUNCATE TABLE rooms;` empties a table and resets the auto increment; it cannot be rolled back.
- Strings use single quotes. Double quotes are identifiers in ANSI mode.
- `LIMIT 10, 20` means offset 10, take 20.

---
id: node-sql-deep
lang: Node.js
title: SQL for the Node exam
---

# SQL for the Node exam

The backend part of the exam is an Express server that talks to MySQL. Each route you write
comes down to one or two statements: list the hotels, search by a word, total the guests in a
date range, insert a booking, change its dates, delete it. The points are lost in the query, not
in the route. A handler that returns 200 with a wrong count looks finished and scores nothing.

This page uses the three tables from `sql/schema.sql`: `customers`, `hotels`, `bookings`. The
column names are the ones the exam task sheet uses, so a query copied from here runs against the
exam database after you change the sample values.

## Simplest form

```sql
-- Data shape: one row per booking, with the hotel name attached
SELECT b.customer_email, h.name, b.start_date, b.end_date
FROM bookings b
JOIN hotels h ON h.id = b.hotel_id
WHERE b.hotel_id = 1;
```

Four clauses, one join. Read it as a sentence: take the bookings, attach the hotel each booking
points at, keep the ones for hotel 1, return four columns. Everything else on this page is that
sentence with more conditions or with counting added.

The same statement from Node, with the id supplied by the request:

```js
// routes/bookings.js, inside an async handler
const [rows] = await pool.execute(
    `SELECT b.customer_email, h.name, b.start_date, b.end_date
     FROM bookings b
     JOIN hotels h ON h.id = b.hotel_id
     WHERE b.hotel_id = ?`,
    [req.params.id]
);
res.json(rows);
```

`execute` sends the id as a bound parameter, so a value like `1 OR 1=1` stays a value and never
becomes SQL. Keep that habit from the first query you write, because rewriting string
concatenation under time pressure is where people slip.

## The order the engine runs a query

You write the clauses in one order and MySQL runs them in another:

1. `FROM` and the joins build the working set of rows.
2. `WHERE` throws rows away.
3. `GROUP BY` folds the remaining rows into groups.
4. `HAVING` throws groups away.
5. `SELECT` computes the output columns and the aliases.
6. `DISTINCT` removes duplicate output rows.
7. `ORDER BY` sorts.
8. `LIMIT` cuts.

Three practical consequences, and each one costs marks if you miss it.

A `SELECT` alias does not exist yet inside `WHERE`, because `SELECT` runs after it. `WHERE nights > 3` fails; `WHERE DATEDIFF(end_date, start_date) > 3` works, and so does the alias in `ORDER BY`, which runs after `SELECT`.

`WHERE` cannot see `COUNT(*)`, because the counting has not happened. Use `HAVING` for conditions on aggregates, and keep row conditions in `WHERE` so the grouping has less to do.

A condition in the `ON` clause of a `LEFT JOIN` is applied while the join is built, and a condition in `WHERE` is applied after. That difference decides whether hotels with no bookings survive the query.

## Every part

### SELECT

`SELECT` names the columns and gives them the names the JSON response will use. List the columns
instead of `*`. The React table reads named fields, and `SELECT *` sends `boylovers` and internal
dates to a page that has no column for them. It also breaks silently the day a column is added.

```sql
SELECT
    h.id,
    h.city,
    h.name,
    h.stars,
    h.image,
    h.owner_email
FROM hotels h
ORDER BY h.name;
```

Aliases with `AS` are how you rename a computed column for the API: `DATEDIFF(end_date, start_date) AS nights`. Without `AS` the driver names the column after the whole expression, and the frontend destructures `nights` and gets `undefined`.

`DISTINCT` applies to the whole selected row, not to the first column. `SELECT DISTINCT city, name` gives distinct pairs, which is almost always every row.

### WHERE

`WHERE` keeps rows where the condition is true. It runs before grouping, so it can use columns but
not aggregates.

```sql
SELECT id, name, city, stars
FROM hotels
WHERE city = 'Budapest' AND stars >= 4;
```

Comparison operators: `=`, `<>` (or `!=`), `<`, `<=`, `>`, `>=`. String comparison follows the
column collation. The schema uses `utf8mb4_unicode_ci`, which is case insensitive, so `'budapest'`
finds `'Budapest'`. Do not rely on that in a different database.

`IN` is a list of alternatives, `BETWEEN` is an inclusive range:

```sql
SELECT id, name FROM hotels WHERE city IN ('Budapest', 'Debrecen');
SELECT id, name, stars FROM hotels WHERE stars BETWEEN 3 AND 5;
```

`BETWEEN 3 AND 5` includes both ends. On dates, `BETWEEN '2025-07-01' AND '2025-07-31'` includes a booking that starts on the 31st, and it cuts off a `DATETIME` value at midnight, which is why exam queries usually compare dates with `<=` and `>=` explicitly.

`AND` binds tighter than `OR`. `WHERE city = 'Budapest' OR city = 'Debrecen' AND stars = 5` means Budapest any stars, or Debrecen with five stars. Parenthesise the group you mean:

```sql
WHERE (city = 'Budapest' OR city = 'Debrecen') AND stars >= 4
```

NULL is not a value you can compare with `=`. `WHERE phone = NULL` matches nothing, ever.
`WHERE phone IS NULL` and `IS NOT NULL` are the operators. A NULL in a comparison makes the whole
condition unknown, which `WHERE` treats as false.

### ORDER BY

`ORDER BY` sorts the result. `ASC` is the default, so write `DESC` where you mean it.

```sql
SELECT id, name, stars FROM hotels ORDER BY stars DESC, name ASC;
```

Several keys are read left to right: highest stars first, and inside equal stars, names A to Z. Without a second key, rows with equal stars come back in whatever order the engine finds them, and the same query can return two different pages on two runs. Add a unique tiebreaker (`id`) whenever the sort key repeats, which on this schema means almost always.

`ORDER BY` can use a column you did not select, an alias, or an expression. Sorting by a computed length is common in this exam:

```sql
SELECT customer_email, hotel_id, start_date, end_date
FROM bookings
ORDER BY DATEDIFF(end_date, start_date) DESC, start_date ASC;
```

MySQL sorts NULLs first in ascending order. If a nullable column drives the order and the first row must be a real value, add `IS NULL` as the first key: `ORDER BY phone IS NULL, phone`.

### LIMIT and OFFSET

`LIMIT n` cuts the result to n rows. `LIMIT offset, n` skips offset rows first. The keyword form
is easier to read: `LIMIT n OFFSET m`.

```sql
-- Page 3 of a 10 row listing
SELECT id, name, city FROM hotels
ORDER BY name, id
LIMIT 10 OFFSET 20;
```

The order matters: `ORDER BY` runs before `LIMIT`. A `LIMIT` without `ORDER BY` gives an arbitrary
ten rows, not the first ten. Pagination without a unique tiebreaker repeats and skips rows when
two rows share the sort value, so order by `name, id` rather than `name`.

In Node, a limit that arrives from `req.query` is a string. `LIMIT ?` works with `execute` but not
with `query`, which quotes it into `LIMIT '10'` and gets a syntax error. Either bind through
`execute`, or parse to a number, check it is a positive integer, and inline it:

```js
const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
const [rows] = await pool.query(`SELECT id, name FROM hotels ORDER BY name, id LIMIT ${limit}`);
```

### JOIN

A join attaches columns from another table using a condition. `JOIN` on its own means
`INNER JOIN`: only rows that find a partner survive.

```sql
SELECT h.id, h.name, c.first_name, c.last_name
FROM hotels h
JOIN customers c ON c.email = h.owner_email;
```

`LEFT JOIN` keeps every row of the left table, and fills the right side with NULL when there is no
match. That is the query for "every hotel and how many bookings it has", because a hotel with zero
bookings must still appear with a zero, not vanish:

```sql
SELECT h.id, h.name, COUNT(b.customer_email) AS bookings
FROM hotels h
LEFT JOIN bookings b ON b.hotel_id = h.id
GROUP BY h.id, h.name
ORDER BY bookings DESC;
```

`COUNT(b.customer_email)` counts non-null values, so a hotel with no booking counts zero.
`COUNT(*)` would count the single NULL-padded row and report one. This is the most common wrong
answer in the whole exam topic.

A filter on the right table belongs in `ON` when the left rows must survive:

```sql
-- every hotel, plus its bookings that start in 2025
SELECT h.id, h.name, b.start_date
FROM hotels h
LEFT JOIN bookings b
       ON b.hotel_id = h.id
      AND b.start_date >= '2025-01-01'
      AND b.start_date < '2026-01-01';
```

Move those two date conditions into `WHERE` and the hotels without a 2025 booking disappear,
because `NULL >= '2025-01-01'` is unknown. The join has quietly become an inner join.

`RIGHT JOIN` mirrors `LEFT JOIN` and is rare; rewrite it as a left join with the tables swapped and
it reads better. `CROSS JOIN` pairs every row with every row and is almost always a mistake when
it appears by accident, because a forgotten `ON` in MySQL is a syntax error, while an `ON 1=1`
produces the multiplication.

Join direction on this schema: `bookings.customer_email` points at `customers.email`, and
`bookings.hotel_id` points at `hotels.id`. `hotels.owner_email` also points at `customers.email`.
So a full booking row needs two joins, one to the guest and one to the hotel, and both use the
same `customers` table under different aliases if the owner is also needed.

### GROUP BY

`GROUP BY` folds rows that share values into one row per group, and then the aggregates compute
over each group.

```sql
SELECT city, COUNT(*) AS hotels, AVG(stars) AS avg_stars
FROM hotels
GROUP BY city
ORDER BY hotels DESC;
```

With `ONLY_FULL_GROUP_BY` on, which is the MySQL 8 default, every selected column must either
appear in `GROUP BY` or sit inside an aggregate. `SELECT id, name, COUNT(*) FROM hotels GROUP BY city`
is rejected, and rightly so: three hotels in one city cannot produce one id. Group by every column
you select that is not aggregated.

Grouping by an expression is allowed and useful for the yearly statistics question:

```sql
SELECT YEAR(start_date) AS booking_year, COUNT(*) AS bookings
FROM bookings
GROUP BY YEAR(start_date)
ORDER BY booking_year;
```

`GROUP BY` also sorts in older MySQL versions. Do not depend on it. Add `ORDER BY`.

### HAVING

`HAVING` filters groups after the aggregates are computed. It is the only place a condition on
`COUNT`, `SUM`, `AVG`, `MIN` or `MAX` can go.

```sql
SELECT h.city, COUNT(*) AS hotels
FROM hotels h
GROUP BY h.city
HAVING COUNT(*) > 1;
```

`WHERE` and `HAVING` in one query split the work: `WHERE` removes rows before grouping (cheap,
and it can use an index), `HAVING` removes groups after (on the smaller grouped result). Asking for
cities with more than one four-star hotel:

```sql
SELECT city, COUNT(*) AS four_star
FROM hotels
WHERE stars = 4
GROUP BY city
HAVING COUNT(*) > 1;
```

A `HAVING` condition on a plain column also works in MySQL, but it reads as a bug. Filter rows in
`WHERE`.

### Aggregates

The five you need: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

`COUNT(*)` counts rows. `COUNT(column)` counts rows where that column is not NULL. `COUNT(DISTINCT column)` counts distinct non-null values, which is the query for "how many different guests booked".

```sql
SELECT
    COUNT(*) AS bookings,
    COUNT(DISTINCT customer_email) AS guests,
    COUNT(phone) AS customers_with_phone
FROM bookings b
JOIN customers c ON c.email = b.customer_email;
```

`SUM` and `AVG` skip NULLs, and return NULL when no row qualifies. `AVG` divides by the number of
non-null rows, not by the number of rows. If the average must treat a missing value as zero, say so
with `AVG(COALESCE(x, 0))`, and know that this changes the meaning of the number.

An empty group set produces one row with `COUNT = 0` and `SUM = NULL`. That NULL reaches
`res.json` as `"total": null` and the frontend prints nothing. Wrap money and guest totals:
`COALESCE(SUM(adults), 0)`. The exam's guest-total query does exactly that.

Adding across nullable columns is worse than it looks. `SUM(adults + children + boylovers)` is
NULL for every row where any part is NULL, and the whole sum collapses. The schema marks the
columns `NOT NULL DEFAULT 0`, so this works there. On a schema that allows NULL, use
`SUM(COALESCE(adults,0) + COALESCE(children,0) + COALESCE(boylovers,0))`.

`GROUP_CONCAT` builds one string from the group, useful when the API returns a compact list:
`GROUP_CONCAT(h.name ORDER BY h.name SEPARATOR ', ')`.

A join that multiplies rows multiplies the sums. If you join `bookings` to a table with two rows
per booking, every booking is counted twice. Check that the join key is unique on the side you
join to, or aggregate in a subquery first.

### INSERT

```sql
INSERT INTO customers (email, first_name, last_name, phone, birthday, image)
VALUES ('dora.toth@example.com', 'Dora', 'Toth', '+36 30 444 4444', '1995-09-09', NULL);
```

Name the columns. A statement without a column list depends on the physical order of the table and
breaks the moment a column is added or the exam database is rebuilt.

Several rows in one statement are faster and atomic:

```sql
INSERT INTO hotels (city, name, description, stars, owner_email)
VALUES
    ('Eger', 'Vineyard House', 'Rooms above a small winery.', 4, 'anna.kovacs@example.com'),
    ('Sopron', 'Old Town Rooms', 'Six rooms in a restored townhouse.', 3, 'ben.nagy@example.com');
```

`hotels.id` is `AUTO_INCREMENT`, so it is left out and the database assigns it. From Node, read it
back through the result object:

```js
const [result] = await pool.execute(
    `INSERT INTO hotels (city, name, description, stars, owner_email)
     VALUES (?, ?, ?, ?, ?)`,
    [city, name, description, stars, ownerEmail]
);
res.status(201).json({ id: result.insertId });
```

`result.affectedRows` is how many rows changed, and `result.insertId` is the generated key of the
first inserted row. Both come from `mysql2` and both are what the route needs for a 201 response.

A duplicate primary key raises `ER_DUP_ENTRY`. The exam wants a 409 for that case, so catch the
error code rather than checking with a second `SELECT` first:

```js
try {
    await pool.execute('INSERT INTO bookings (customer_email, hotel_id, start_date, end_date) VALUES (?, ?, ?, ?)', values);
} catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Booking already exists' });
    throw err;
}
```

The check-then-insert version has a race: two requests both see no row, both insert, one fails.
The unique key is the real guarantee.

`INSERT ... ON DUPLICATE KEY UPDATE` upserts in one statement. Handy for a "save booking" endpoint
that may create or change:

```sql
INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults)
VALUES (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    start_date = VALUES(start_date),
    end_date = VALUES(end_date),
    adults = VALUES(adults);
```

`VALUES(col)` inside the update refers to the value that was proposed for insert. MySQL 8.0.20
deprecates it in favour of the `AS new` alias form, and both work on the exam server. Check
`affectedRows`: 1 means inserted, 2 means updated, 0 means the update changed nothing.

### UPDATE

```sql
UPDATE bookings
SET start_date = '2025-09-02',
    end_date = '2025-09-04',
    adults = 3
WHERE customer_email = 'dora.toth@example.com'
  AND hotel_id = 1;
```

`WHERE` selects the rows. Without it, every row changes. Before running an update, run the same
`WHERE` as a `SELECT` and count the rows.

The primary key of `bookings` is `(customer_email, hotel_id)`, so an update never changes those two
columns. Changing them is a delete plus an insert, or the row would break the foreign keys or
collide with an existing pair.

Partial update from a PATCH route: the request may send only some fields. Two ways, and both are
acceptable. `COALESCE` keeps the old value when the new one is NULL:

```sql
UPDATE bookings
SET start_date = COALESCE(?, start_date),
    end_date = COALESCE(?, end_date),
    adults = COALESCE(?, adults)
WHERE customer_email = ? AND hotel_id = ?;
```

The other way builds the `SET` list in JavaScript from the fields that were sent. It is more code
and easier to get wrong, because column names cannot be bound as parameters. If you build it,
pick the column names from a fixed whitelist, never from the request body.

`UPDATE` on a column with a `CHECK` constraint fails the whole statement if one row violates it.
`start_date <= end_date` is evaluated per statement, so swapping the two dates with two separate
updates fails on the first one. Write both columns in one `UPDATE`.

### DELETE

```sql
DELETE FROM bookings
WHERE customer_email = 'dora.toth@example.com'
  AND hotel_id = 1;
```

Same rule as `UPDATE`: run the `WHERE` as a `SELECT` first. `affectedRows` tells you whether
anything matched, which the route turns into 204 or 404.

`DELETE FROM customers` fails while the customer owns a hotel, because `fk_hotels_owner` uses
`ON DELETE RESTRICT`. It succeeds for a guest, because `fk_bookings_customer` uses
`ON DELETE CASCADE` and the bookings go with the row. Know which foreign key does which before
writing the delete endpoint, and do not promise cascade in the API where the schema restricts.

`TRUNCATE TABLE bookings` empties a table and resets `AUTO_INCREMENT`. It is not a `DELETE`, cannot
be rolled back, and refuses while another table points at it. Never in a route.

### Dates

The date columns are `DATE`, not `DATETIME`. A `DATE` has no time part, so `'2025-07-01'` and
`'2025-07-01 00:00:00'` are the same day for comparison purposes.

```sql
SELECT CURDATE();                              -- today, for example 2026-11-11
SELECT NOW();                                  -- today with the current time
SELECT YEAR(start_date), MONTH(start_date), DAY(start_date) FROM bookings;
SELECT DATE_FORMAT(start_date, '%Y-%m') AS month FROM bookings;
SELECT DATE_ADD(start_date, INTERVAL 7 DAY) FROM bookings;
SELECT DATEDIFF('2025-07-05', '2025-07-01');   -- 4
```

`DATEDIFF(a, b)` is a minus b in whole days, and the order is the part people reverse. Nights in a
booking are `DATEDIFF(end_date, start_date)`, which is 4 for a stay from the 1st to the 5th.

MySQL accepts `'2025-07-01'` as a date literal. `STR_TO_DATE('01/07/2025', '%d/%m/%Y')` converts
another format, and `DATE_FORMAT` converts out. Both take a format string where `%d` is day, `%m`
month, `%Y` four digit year, `%H:%i` hours and minutes.

Comparing a `DATE` column to a string works. Comparing it to a number does not do what you expect:
`WHERE start_date = 20250701` converts the column and skips the index. Keep dates as `'YYYY-MM-DD'`
strings all the way from the request to the query, and reject anything that does not match that
shape before it reaches MySQL.

`YEAR(start_date) = 2025` is readable and cannot use an index on `start_date`. On an exam table
this is irrelevant. On a large table write the range: `start_date >= '2025-01-01' AND start_date < '2026-01-01'`.
The second form also includes the last day correctly, while `<= '2025-12-31'` breaks the day a
`DATETIME` column appears.

### Overlap range

The exam asks for bookings that overlap a period, or for the guest totals of those bookings. Two
ranges overlap when neither ends before the other starts:

```sql
-- stays that touch the period 2025-07-01 to 2025-07-31
SELECT customer_email, hotel_id, start_date, end_date
FROM bookings
WHERE start_date <= '2025-07-31'
  AND end_date   >= '2025-07-01';
```

Read it as: the booking starts before the period ends, and the booking ends after the period
starts. A booking that ends on July 1 is included, and so is one that starts on July 31. That
matches the exam wording when the period is inclusive.

For room availability the opposite rule is usually wanted, because a guest leaving on the 10th
frees the room for the night of the 10th:

```sql
-- rooms free for the night of 2025-07-10
WHERE NOT (start_date <= '2025-07-10' AND end_date > '2025-07-10')
```

Pick one convention, write it in a comment above the query, and test the boundary case where a
booking ends exactly on the arrival date. Boundary mistakes here are the ones that pass the
obvious test and fail the examiner's.

The single-statement guest total for the period:

```sql
SELECT
    COALESCE(SUM(adults), 0)    AS adults,
    COALESCE(SUM(children), 0)  AS children,
    COALESCE(SUM(boylovers), 0) AS boylovers
FROM bookings
WHERE start_date <= ?
  AND end_date   >= ?;
```

The request supplies the two dates in the order end, start, because that is the order the
comparisons use. Naming the bound values instead of relying on position makes the route easier to
read:

```js
const [rows] = await pool.execute(sql, [toDate, fromDate]);
```

### Search with LIKE

`LIKE` matches a pattern. `%` stands for any run of characters, including none, and `_` stands for
exactly one character.

```sql
SELECT id, name FROM hotels WHERE name LIKE 'Lake%';       -- starts with Lake
SELECT id, name FROM hotels WHERE name LIKE '%View';       -- ends with View
SELECT id, name FROM hotels WHERE name LIKE '%Gar%';       -- contains Gar
SELECT id, name FROM hotels WHERE name LIKE 'Lake_arden';  -- one character in the gap
```

The exam search box looks in guest names and hotel names and descriptions, so the pattern is built
from a word the user typed:

```sql
SET @word = 'anna';
SELECT b.customer_email, c.first_name, c.last_name,
       h.name AS hotel, b.start_date, b.end_date
FROM bookings b
JOIN customers c ON c.email = b.customer_email
JOIN hotels h    ON h.id = b.hotel_id
WHERE c.first_name LIKE CONCAT('%', @word, '%')
   OR c.last_name  LIKE CONCAT('%', @word, '%')
   OR CONCAT(c.first_name, ' ', c.last_name) LIKE CONCAT('%', @word, '%')
   OR h.name        LIKE CONCAT('%', @word, '%')
   OR h.description LIKE CONCAT('%', @word, '%')
ORDER BY b.start_date;
```

Build the pattern in the driver, not with string concatenation into the SQL:

```js
const pattern = `%${word}%`;
const [rows] = await pool.execute(sql, [pattern, pattern, pattern, pattern, pattern]);
```

`CONCAT('%', ?, '%')` inside the SQL is equally safe and avoids counting placeholders by hand,
which is why the exam's own query file uses it.

Two limits to know. A leading `%` cannot use a normal index, so `%word%` reads the table; on an
exam table that is fine, on a million rows it is not. And the user's `%` or `_` is a wildcard too,
so a search for `50%` matches more than intended. Escape it if the task cares:
`LIKE CONCAT('%', REPLACE(REPLACE(?, '%', '\\%'), '_', '\\_'), '%') ESCAPE '\\'`.

`LIKE` with a trailing space, a case difference or a hyphen all behave differently depending on the
collation. The schema is case insensitive, which is what the search box wants.

### Indexes

An index is a sorted structure on one or more columns. It turns a scan into a lookup for
equality and range filters, joins and sorts, and it costs space and a little write speed.

```sql
CREATE INDEX idx_bookings_hotel ON bookings (hotel_id);
CREATE INDEX idx_bookings_dates ON bookings (start_date, end_date);
CREATE INDEX idx_hotels_owner   ON hotels (owner_email);
CREATE UNIQUE INDEX uq_customer_phone ON customers (phone);
```

Primary keys and unique keys are indexed automatically. That is why `bookings` needs no extra index
on `(customer_email, hotel_id)`: it is the primary key. Lookups by `hotel_id` alone need the new
index, because a composite index can only be used from its leftmost column. `(hotel_id, start_date)`
serves `WHERE hotel_id = 1` and `WHERE hotel_id = 1 AND start_date >= ...` but not `WHERE start_date >= ...`.

`EXPLAIN` in front of a query prints the plan:

```sql
EXPLAIN SELECT * FROM bookings WHERE hotel_id = 1;
```

`type = ALL` means a full scan, `ref` or `range` means an index did part of the work, and `rows`
estimates how many rows were read. This is the answer to "how would you check the index is used",
and it is worth one sentence in the exam if the task asks about performance.

Do not index every column. A low-cardinality column such as `stars` with six possible values rarely
helps alone, and each extra index slows every insert. On this schema the useful ones are the three
above plus whatever the search endpoint needs.

### Transactions

A transaction groups statements so they land together or not at all. `START TRANSACTION`, then
`COMMIT`, or `ROLLBACK` to undo everything since the start.

```sql
START TRANSACTION;
INSERT INTO customers (email, first_name, last_name)
VALUES ('eva.molnar@example.com', 'Eva', 'Molnar');
INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults)
VALUES ('eva.molnar@example.com', 2, '2025-10-01', '2025-10-03', 1);
COMMIT;
```

If the second insert fails, the first one is still uncommitted, and a rollback leaves the database
as it was. Without the transaction the customer exists with no booking, and the next attempt hits
a duplicate key.

In Node, a transaction needs one connection for every statement in it. `pool.query` takes a
connection from the pool per call, so three `pool.query` calls are not a transaction:

```js
const conn = await pool.getConnection();
try {
    await conn.beginTransaction();
    await conn.execute('INSERT INTO customers (email, first_name, last_name) VALUES (?, ?, ?)', [email, first, last]);
    await conn.execute(
        'INSERT INTO bookings (customer_email, hotel_id, start_date, end_date, adults) VALUES (?, ?, ?, ?, ?)',
        [email, hotelId, start, end, adults]
    );
    await conn.commit();
    res.status(201).json({ email });
} catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Already exists' });
    res.status(500).json({ error: 'Insert failed' });
} finally {
    conn.release();
}
```

The `finally` matters. A connection that is never released leaks from the pool, and after ten such
requests the server stops answering. `startTransaction` is the same call as `beginTransaction` in
`mysql2`.

Keep a transaction short. It holds row locks from the first write until the commit, and a slow
email or a fetch to another service inside it keeps those locks for the whole wait.

### Injection

SQL injection happens when user text becomes part of the statement. The fix is a bound parameter,
not a filter on the string.

```js
// wrong: the request writes the SQL
const sql = `SELECT * FROM hotels WHERE city = '${req.query.city}'`;
// a city of  ' OR '1'='1  returns every hotel
// a city of  '; DROP TABLE hotels; --  ends the table

// right: the driver sends the value separately
const [rows] = await pool.execute('SELECT * FROM hotels WHERE city = ?', [req.query.city]);
```

`mysql2` escapes the value, quotes it and sends it as data. The server never parses it as SQL.
Use `execute` (prepared statements) over `query` where you can; both escape, `execute` also caches
the prepared statement.

Three places a placeholder cannot go, because they are not values:

A table or column name (`ORDER BY ${sort}`), which needs a whitelist:
`const sort = ['name', 'city', 'stars'].includes(req.query.sort) ? req.query.sort : 'name';`
A keyword such as `ASC` or `DESC`, same whitelist. A `LIMIT`, which can be bound with `execute`,
or parsed to an integer and inlined.

Validation still matters after the placeholders. A bound value cannot inject, but a `stars` of
`-1` or a date of `'not a date'` is still wrong input, and MySQL either coerces it silently or
throws. Check the shape in the route and answer 400 before the query runs.

## The hotel and booking schema

The full schema with the parts that matter for the queries above. It is the exam schema with the
comments rewritten so the reasons are visible.

```sql
-- One row per guest. The email is the primary key, so it is the identity
-- used by bookings and by hotel ownership.
CREATE TABLE customers (
    email      VARCHAR(120) PRIMARY KEY,
    first_name VARCHAR(80)  NOT NULL,
    last_name  VARCHAR(80)  NOT NULL,
    phone      VARCHAR(40)  NULL,        -- nullable: many rows have no phone
    birthday   DATE         NULL,
    image      VARCHAR(500) NULL          -- URL shown in the list and the card
) ENGINE = InnoDB;

-- One row per hotel. id is generated, because the exam data has no natural key.
CREATE TABLE hotels (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    city        VARCHAR(80)  NOT NULL,
    name        VARCHAR(120) NOT NULL,
    description TEXT         NULL,
    stars       TINYINT      NOT NULL DEFAULT 0,
    owner_email VARCHAR(120) NOT NULL,
    image       VARCHAR(500) NULL,
    CONSTRAINT fk_hotels_owner FOREIGN KEY (owner_email) REFERENCES customers (email)
        ON UPDATE CASCADE ON DELETE RESTRICT,   -- a guest with hotels cannot be deleted
    CONSTRAINT chk_hotels_stars CHECK (stars BETWEEN 0 AND 5)
) ENGINE = InnoDB;

-- One row per booking. There is no id column: the pair of guest and hotel
-- identifies the row, so a guest cannot book the same hotel twice.
CREATE TABLE bookings (
    customer_email VARCHAR(120)    NOT NULL,
    hotel_id       INT             NOT NULL,
    start_date     DATE            NOT NULL,
    end_date       DATE            NOT NULL,
    adults         TINYINT UNSIGNED NOT NULL DEFAULT 1,
    children       TINYINT UNSIGNED NOT NULL DEFAULT 0,
    boylovers      TINYINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (customer_email, hotel_id),
    CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_email) REFERENCES customers (email)
        ON UPDATE CASCADE ON DELETE CASCADE,   -- deleting a guest deletes their bookings
    CONSTRAINT fk_bookings_hotel FOREIGN KEY (hotel_id) REFERENCES hotels (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_booking_dates CHECK (start_date <= end_date)
) ENGINE = InnoDB;
```

The consequences worth saying out loud in the exam:

1. `bookings` has no `id`, so every update and delete addresses a row by `customer_email` and `hotel_id` together.
2. `start_date <= end_date` is enforced. An insert with the dates swapped fails, and the API should answer 400, not 500.
3. Deleting a guest cascades to bookings but is blocked while the guest owns a hotel. The order matters in a delete-all test.
4. The guest count of a booking is three columns, and a NULL in any of them would poison a plain sum. They are `NOT NULL DEFAULT 0`, so `adults + children + boylovers` is safe here.
5. `customers.email` is a string key, so a typo in an email creates a new guest instead of failing. Normalise to lower case before insert if the task wants that.

## Examples

### Example 1: the hotel list with its owner

The route a React list calls first. Two tables, one join, one sort.

```sql
-- GET /api/hotels
-- Returns every hotel with the owner name and both images.
-- Aliases keep the two image columns apart in the JSON.
SELECT
    h.id,
    h.city,
    h.name,
    h.description,
    h.stars,
    h.image       AS hotel_image,
    h.owner_email,
    c.first_name,
    c.last_name,
    c.image       AS owner_image
FROM hotels h
JOIN customers c ON c.email = h.owner_email
ORDER BY h.name ASC, h.id ASC;
```

```js
// routes/hotels.js
router.get('/api/hotels', async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT h.id, h.city, h.name, h.description, h.stars,
                   h.image AS hotel_image, h.owner_email,
                   c.first_name, c.last_name, c.image AS owner_image
            FROM hotels h
            JOIN customers c ON c.email = h.owner_email
            ORDER BY h.name ASC, h.id ASC`);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});
```

No placeholders here because no user value enters the statement. `pool.query` is fine for a fixed
string; use `execute` as soon as a value comes from the request.

### Example 2: bookings of one hotel, oldest first

The detail page. The hotel id arrives in the path, so it is bound.

```sql
-- GET /api/hotels/:id/bookings
SELECT
    b.customer_email,
    b.hotel_id,
    b.start_date,
    b.end_date,
    DATEDIFF(b.end_date, b.start_date) AS nights,
    b.adults,
    b.children,
    b.boylovers,
    c.first_name,
    c.last_name,
    c.image AS customer_image
FROM bookings b
JOIN customers c ON c.email = b.customer_email
WHERE b.hotel_id = ?
ORDER BY b.start_date ASC, b.customer_email ASC;
```

A hotel with no bookings returns an empty array, because `JOIN` on an empty side produces no rows.
That is the correct answer for a list, and the frontend shows "no bookings yet". Do not switch to
`LEFT JOIN` here: the booking rows would all be NULL and the page would render one fake row.

Add the night count in SQL rather than in JavaScript so the list can be sorted by it and the
frontend does not repeat the date maths.

### Example 3: search in names, hotel names and descriptions

The search box from the exam, with the pattern bound once per use. It is the same query as
`sql/queries.sql`, written so the placeholder count is easy to check.

```sql
-- GET /api/search?word=anna
-- A booking matches when the guest name, the hotel name or the hotel
-- description contains the word. Empty word returns nothing, not everything;
-- the route decides that before it calls the database.
SET @word = 'anna';

SELECT
    b.customer_email,
    c.first_name,
    c.last_name,
    c.image AS customer_image,
    b.hotel_id,
    h.name AS hotel_name,
    h.city,
    b.start_date,
    b.end_date,
    b.adults,
    b.children,
    b.boylovers
FROM bookings b
JOIN customers c ON c.email = b.customer_email
JOIN hotels h    ON h.id = b.hotel_id
WHERE c.first_name LIKE CONCAT('%', @word, '%')
   OR c.last_name  LIKE CONCAT('%', @word, '%')
   OR CONCAT(c.first_name, ' ', c.last_name) LIKE CONCAT('%', @word, '%')
   OR h.name        LIKE CONCAT('%', @word, '%')
   OR h.description LIKE CONCAT('%', @word, '%')
ORDER BY b.start_date ASC, b.hotel_id ASC;
```

The `CONCAT(c.first_name, ' ', c.last_name)` line is what lets a search for "Anna Kov" find the
guest, because neither column alone contains that text. Keep it next to the two single-column
checks; it does not replace them.

A search that must also return hotels with no booking cannot start from `bookings`. That needs a
`UNION` of a hotel query and a booking query, or a left join with the guest part in the `ON`
clause. The exam only asks for rows that have both sides.

### Example 4: guest totals for an overlapping period

Counting people, not bookings. Three sums, one filter, one row back.

```sql
-- GET /api/stats/guests?from=2025-07-01&to=2025-07-31
-- A booking counts when any night of it falls inside the period.
SELECT
    COALESCE(SUM(adults), 0)    AS adults,
    COALESCE(SUM(children), 0)  AS children,
    COALESCE(SUM(boylovers), 0) AS boylovers,
    COALESCE(SUM(adults + children + boylovers), 0) AS total_guests,
    COUNT(*) AS bookings
FROM bookings
WHERE start_date <= ?   -- period end
  AND end_date   >= ?;  -- period start
```

`COUNT(*)` is safe with no group because the query has no `GROUP BY`: it returns exactly one row,
zero when nothing matches. `SUM` would be NULL there, hence the `COALESCE`.

If the task asks for a per-hotel breakdown, add the join and the group, and remember the left join
rule when hotels without guests must appear:

```sql
SELECT h.id, h.name,
       COALESCE(SUM(b.adults + b.children + b.boylovers), 0) AS guests
FROM hotels h
LEFT JOIN bookings b
       ON b.hotel_id = h.id
      AND b.start_date <= ?
      AND b.end_date   >= ?
GROUP BY h.id, h.name
ORDER BY guests DESC, h.name ASC;
```

### Example 5: yearly statistics, longest stay, short stays

Three separate statements, the way the Java console task asks for them in one program. Each one is
a single query, so the Node equivalent is three awaits or one transaction.

```sql
-- a) bookings per year, ascending
SELECT YEAR(start_date) AS booking_year, COUNT(*) AS bookings
FROM bookings
GROUP BY YEAR(start_date)
ORDER BY booking_year ASC;

-- b) the longest stay, one row
SELECT customer_email, hotel_id, start_date, end_date,
       DATEDIFF(end_date, start_date) AS nights
FROM bookings
ORDER BY nights DESC, start_date ASC
LIMIT 1;

-- c) stays of at most one night
SELECT customer_email, hotel_id, start_date, end_date,
       DATEDIFF(end_date, start_date) AS nights
FROM bookings
WHERE DATEDIFF(end_date, start_date) <= 1
ORDER BY start_date ASC;
```

Ties in (b) need a rule. `ORDER BY nights DESC, start_date ASC` picks the earlier start, which is
a decision you can defend. Without the second key the query returns an arbitrary one of the tied
rows, and the examiner's expected name may differ from yours for no visible reason.

The yearly count can be done with `GROUP BY YEAR(start_date)` or with `GROUP BY booking_year`
referring to the alias. Both work in MySQL; the first is clearer when read by someone who knows
the pipeline order.

### Example 6: a whole API route file on top of this schema

One file, fully commented, showing where each query sits. It is the shape the backend task asks
for: a list, a search, a date filter, an insert with a transaction, an update and a delete.

```js
// routes/bookings.js
// Express router for the bookings backend. The pool comes from db.js and
// already has the database selected.
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Small helpers keep validation out of the handlers.
const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');
const toInt = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : fallback;
};

// GET /api/bookings?hotel=1&from=2025-07-01&to=2025-07-31
// All three filters are optional. The WHERE list is built from fixed
// fragments, never from request text, and the values stay bound.
router.get('/api/bookings', async (req, res, next) => {
    const where = [];
    const values = [];

    if (req.query.hotel) {
        where.push('b.hotel_id = ?');
        values.push(req.query.hotel);
    }
    if (isDate(req.query.from)) {
        where.push('b.end_date >= ?');
        values.push(req.query.from);
    }
    if (isDate(req.query.to)) {
        where.push('b.start_date <= ?');
        values.push(req.query.to);
    }

    const sql = `
        SELECT b.customer_email, b.hotel_id, b.start_date, b.end_date,
               DATEDIFF(b.end_date, b.start_date) AS nights,
               b.adults, b.children, b.boylovers,
               c.first_name, c.last_name, h.name AS hotel_name
        FROM bookings b
        JOIN customers c ON c.email = b.customer_email
        JOIN hotels h    ON h.id = b.hotel_id
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY b.start_date, b.customer_email`;

    try {
        const [rows] = await pool.execute(sql, values);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// POST /api/bookings
// Creates the guest when the email is new, then the booking, in one transaction.
// A duplicate booking answers 409 instead of 500.
router.post('/api/bookings', async (req, res, next) => {
    const { customer_email, hotel_id, first_name, last_name, start_date, end_date } = req.body;

    if (!customer_email || !hotel_id || !isDate(start_date) || !isDate(end_date)) {
        return res.status(400).json({ error: 'customer_email, hotel_id and two dates are required' });
    }
    if (start_date > end_date) {
        return res.status(400).json({ error: 'start_date must not be after end_date' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // The guest may already exist. INSERT IGNORE keeps the row and does not
        // overwrite the name that is already stored.
        await conn.execute(
            `INSERT IGNORE INTO customers (email, first_name, last_name)
             VALUES (?, ?, ?)`,
            [customer_email, first_name || '', last_name || '']
        );

        await conn.execute(
            `INSERT INTO bookings
                 (customer_email, hotel_id, start_date, end_date, adults, children, boylovers)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                customer_email,
                hotel_id,
                start_date,
                end_date,
                toInt(req.body.adults, 1),
                toInt(req.body.children, 0),
                toInt(req.body.boylovers, 0)
            ]
        );

        await conn.commit();
        res.status(201).json({ customer_email, hotel_id });
    } catch (err) {
        await conn.rollback();
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'This guest already booked this hotel' });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Unknown hotel' });
        }
        next(err);
    } finally {
        conn.release();
    }
});

// PATCH /api/bookings/:email/:hotelId
// Only the fields present in the body are written. COALESCE with NULL keeps
// the old value, so the route does not need a dynamic SET list.
router.patch('/api/bookings/:email/:hotelId', async (req, res, next) => {
    const { start_date, end_date, adults, children, boylovers } = req.body;

    try {
        const [result] = await pool.execute(
            `UPDATE bookings
                SET start_date = COALESCE(?, start_date),
                    end_date   = COALESCE(?, end_date),
                    adults     = COALESCE(?, adults),
                    children   = COALESCE(?, children),
                    boylovers  = COALESCE(?, boylovers)
              WHERE customer_email = ? AND hotel_id = ?`,
            [start_date ?? null, end_date ?? null, adults ?? null, children ?? null,
             boylovers ?? null, req.params.email, req.params.hotelId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json({ updated: true });
    } catch (err) {
        if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            return res.status(400).json({ error: 'start_date must not be after end_date' });
        }
        next(err);
    }
});

// DELETE /api/bookings/:email/:hotelId
// The composite key identifies the row. 204 on success, 404 when nothing matched.
router.delete('/api/bookings/:email/:hotelId', async (req, res, next) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM bookings WHERE customer_email = ? AND hotel_id = ?',
            [req.params.email, req.params.hotelId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

export default router;
```

`INSERT IGNORE` turns a duplicate key and several other errors into warnings, so it can hide a bad
value as well as a duplicate. Here it is only meant to absorb the existing guest, because
`customers.first_name` and `last_name` are `NOT NULL` and the code supplies empty strings. If that
trade is not acceptable, `SELECT` the guest first, then insert only when missing, inside the same
transaction.

The `?? null` in the PATCH is deliberate: `undefined` from a missing field would also become
`NULL`, and `COALESCE` treats the two the same. The difference matters only if a field must be
set to empty, and none of these columns can be empty.

## Common mistakes

1. **Counting a left join with `COUNT(*)`.** A hotel with no bookings appears once with NULLs and counts as one. Use `COUNT(b.customer_email)`.
2. **Putting right-table filters in `WHERE` after a `LEFT JOIN`.** The left rows vanish and the join behaves like an inner join. Move the condition into `ON`.
3. **Forgetting the tiebreaker in `ORDER BY`.** Pagination repeats and skips rows, and "the longest booking" picks an arbitrary row among ties.
4. **`= NULL` instead of `IS NULL`.** The condition is never true, and the query returns an empty list that looks like missing data.
5. **`SUM` over an empty set.** It returns NULL, and the JSON shows null instead of 0. Wrap totals in `COALESCE`.
6. **Building SQL with template strings.** The route works until a name contains an apostrophe, and then it breaks or worse. Bind every value.
7. **`LIMIT ?` with `pool.query`.** The driver quotes the number and MySQL rejects the syntax. Use `execute`, or parse and inline an integer.
8. **`pool.query` inside a transaction.** Each call may use a different connection, so `COMMIT` commits nothing. Take one connection and use it throughout.
9. **Assuming `GROUP BY` sorts.** It does in old versions and does not in new ones. Write `ORDER BY`.
10. **Selecting a non-aggregated column that is not grouped.** MySQL 8 rejects it; older modes return an arbitrary value that changes between runs.
11. **Summing a formula over nullable columns.** One NULL makes the whole `SUM` NULL. Use `COALESCE` per column when the schema allows NULL.
12. **`YEAR(start_date) = 2025` on a large table.** It is correct but cannot use the index on `start_date`. Prefer the half-open range.
13. **Comparing dates as strings in another format.** `'07/01/2025'` does not mean July 1 to MySQL. Keep `YYYY-MM-DD` end to end.
14. **`DELETE` or `UPDATE` without `WHERE`.** It runs once in testing with one row and destroys the exam database. Test the `WHERE` as a `SELECT`.
15. **Treating `NOT IN` with a nullable column as safe.** One NULL in the list makes the whole predicate unknown, so `NOT IN` returns nothing. Use `NOT EXISTS`.
16. **Changing the primary key of `bookings`.** `(customer_email, hotel_id)` is the identity. Moving a booking to another hotel is a delete plus an insert.
17. **Leaking the connection in the error path.** Without `finally { conn.release(); }` the pool empties after a few failures and every later request hangs.
18. **Returning `200` for a create.** The frontend and the examiner both expect `201` plus the new key, or `204` for a delete.

## Exam checklist

Before you call the backend done, run this list against your own server.

1. `sql/schema.sql` loads without error, and the sample rows are there. Check with `SELECT COUNT(*) FROM bookings;`.
2. Every route that takes a value from the request uses `?` placeholders, including the search pattern and the ids.
3. The list endpoint returns the owner name and both images, with distinct aliases.
4. The search endpoint searches guest first name, last name, the joined full name, hotel name and description, and returns rows only when the word is non-empty.
5. The date filter uses the overlap rule, `start_date <= to AND end_date >= from`, and handles a booking that ends exactly on the start date.
6. Guest totals use `COALESCE(SUM(...), 0)` and return a row even when nothing matches.
7. The yearly statistics group by `YEAR(start_date)` and sort ascending.
8. The longest stay query has a tiebreaker and returns exactly one row.
9. A hotel with no bookings still appears in the per-hotel statistics, with zero guests.
10. `POST` with an existing `(customer_email, hotel_id)` returns 409, not 500.
11. `PATCH` with no fields leaves the row unchanged, and with an end before the start returns 400.
12. `DELETE` of a missing row returns 404, and of an existing row returns 204.
13. A transaction route uses one connection, `beginTransaction`, `commit`, `rollback` and `release` in `finally`.
14. `start_date > end_date` is rejected before the insert, so the `CHECK` constraint is a second line of defence, not the message.
15. `EXPLAIN` on the hotel filter shows an index, and `CREATE INDEX` statements run without duplicating an existing key.
16. The server answers with MySQL stopped, with a JSON 500 and not a crash.
17. Two browser tabs create the same guest at once and one gets 409, not a duplicate row.
18. `node --check` passes on every file you touched, and the console has no unhandled rejection after a failed request.

A query that returns the right number of rows on the sample data can still be wrong on the exam
data. Run the boundary cases: a stay that starts on the period end, one that ends on the period
start, a hotel with no bookings, a guest with no phone, and a search word that matches nothing.
Those five checks catch most of the list above.

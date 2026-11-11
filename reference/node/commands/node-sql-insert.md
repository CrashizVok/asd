# INSERT INTO

Node.js command · Writing

Adds rows. Always name the columns, and bind the values from Node with placeholders.

## Syntax

```js
INSERT INTO table (columns) VALUES (values)
```

## Example

```js
-- One guest, all columns named
INSERT INTO customers (email, first_name, last_name, phone, birthday, image)
VALUES ('dora.toth@example.com', 'Dora', 'Toth', '+36 30 444 4444', '1995-09-09', NULL);

-- Two hotels in one statement. id is AUTO_INCREMENT, so it is left out.
INSERT INTO hotels (city, name, description, stars, owner_email)
VALUES ('Eger', 'Vineyard House', 'Rooms above a small winery.', 4, 'anna.kovacs@example.com'),
       ('Sopron', 'Old Town Rooms', 'Six rooms in a restored townhouse.', 3, 'ben.nagy@example.com');

-- From Node, the values stay separate from the SQL
const [result] = await pool.execute(
    'INSERT INTO customers (email, first_name, last_name) VALUES (?, ?, ?)',
    [email, firstName, lastName]
);
```

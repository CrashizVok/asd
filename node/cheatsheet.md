# Node.js and Express cheat sheet

## Create a server

```js
import express from 'express';
const app = express();
app.use(express.json());
app.listen(3000, () => console.log('http://localhost:3000'));
```

With CommonJS:

```js
const express = require('express');
const app = express();
```

## Routes

```js
app.get('/api/hotels', (req, res) => res.json([]));
app.get('/api/hotels/:id', (req, res) => res.json({ id: req.params.id }));
app.post('/api/hotels', (req, res) => res.status(201).json(req.body));
app.put('/api/hotels/:id', (req, res) => res.json({ updated: true }));
app.delete('/api/hotels/:id', (req, res) => res.status(204).end());
```

## Request data

```js
req.params.id          // /hotels/:id
req.query.page         // /hotels?page=2
req.body               // JSON body, needs express.json()
req.headers.authorization
```

## Response

```js
res.json(data);
res.status(201).json(data);
res.status(400).json({ error: 'Bad input' });
res.status(404).json({ error: 'Not found' });
res.status(409).json({ error: 'Duplicate' });
res.status(500).json({ error: 'Server error' });
res.sendStatus(204);
```

## Middleware

```js
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});
```

The error middleware must have four parameters. Express recognises it by that signature.

## Async route

```js
app.get('/api/hotels', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hotels');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});
```

Always use `try/catch` with `next(error)`. An unhandled rejected promise can crash the process or hang the request.

## MySQL with mysql2

```js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookings',
  dateStrings: true,
});

const [rows] = await pool.query('SELECT * FROM hotels WHERE id = ?', [id]);
const [result] = await pool.query('INSERT INTO hotels (name) VALUES (?)', [name]);
result.insertId;
result.affectedRows;
```

`pool.query` returns `[rows, fields]` for SELECT and `[result, fields]` for INSERT, UPDATE, DELETE.

## Joins

```sql
SELECT h.id, h.name, c.first_name, c.last_name
FROM hotels h
JOIN customers c ON c.email = h.owner_email
ORDER BY h.name;
```

## Dynamic update

```js
const allowed = ['start_date', 'end_date', 'adults'];
const sets = [];
const values = [];

for (const field of allowed) {
  if (body[field] !== undefined) {
    sets.push(`${field} = ?`);
    values.push(body[field]);
  }
}

if (sets.length === 0) {
  return res.status(400).json({ error: 'No fields' });
}

await pool.query(
  `UPDATE bookings SET ${sets.join(', ')} WHERE customer_email = ? AND hotel_id = ?`,
  [...values, email, hotelId]
);
```

The field names come from a fixed list, never from the request body. Values always go through placeholders.

## Search

```js
const word = req.params.word;
const like = `%${word}%`;
const [rows] = await pool.query(
  `SELECT * FROM hotels WHERE name LIKE ? OR description LIKE ?`,
  [like, like]
);
```

## Duplicate and foreign key errors

```js
try {
  await pool.query('INSERT INTO customers (email) VALUES (?)', [email]);
} catch (error) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Already exists' });
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'Missing parent row' });
  }
  next(error);
}
```

## Environment variables

```js
import 'dotenv/config';
const port = process.env.PORT || 3000;
```

`.env`:

```text
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=bookings
```

Never commit `.env`. Commit `.env.example` with empty values.

## CORS

```js
import cors from 'cors';
app.use(cors());
```

For one origin:

```js
app.use(cors({ origin: 'http://localhost:5173' }));
```

## Validate input

```js
const email = typeof body.email === 'string' ? body.email.trim() : '';
if (!email) return res.status(400).json({ error: 'Email is required' });

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
if (!datePattern.test(body.start_date)) {
  return res.status(400).json({ error: 'Bad date' });
}

const number = Number(body.adults);
if (!Number.isInteger(number) || number < 0) {
  return res.status(400).json({ error: 'Bad count' });
}
```

## Serve static files

```js
app.use('/images', express.static('public/images'));
```

## Useful status codes

| Code | Meaning |
|---:|---|
| 200 | OK |
| 201 | Created |
| 204 | No content |
| 400 | Bad request |
| 401 | Not authenticated |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict, usually a duplicate |
| 500 | Server error |

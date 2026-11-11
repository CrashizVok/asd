---
id: node-express-knex-project
lang: Node.js
title: Express and Knex project
---

# Express and Knex project

A booking API is a good exam target because it hits the parts that break in real code: joins, date ranges, a partial update, and one error path shared by every route. The project below fits on a few screens, runs against MySQL, and has no framework magic beyond Express and Knex.

## Simplest form

```js
// Data shape:
// GET /api/hotels -> [ { id, city, name, stars, owner_email } ]
// Table: hotels(id, city, name, description, stars, image, owner_email)
import express from 'express';
import knex from 'knex';

const db = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bookings',
    },
});

const app = express();

app.get('/api/hotels', async (request, response, next) => {
    try {
        const rows = await db('hotels').select('id', 'city', 'name', 'stars', 'owner_email');
        response.json(rows);
    } catch (error) {
        next(error); // one error middleware answers every failure
    }
});

app.listen(3000);
```

That is a working API for one table. The rest of this page adds tables, routers, checks, a search route, a date range route, and the shared error path.

## What it does

Knex is a query builder, not an ORM. `db('hotels')` starts a select, `.where()` appends a clause, and awaiting the builder sends it through the mysql2 driver. You still write SQL-shaped code, except values become placeholders, so a search word containing a quote cannot break the statement.

Express handles the HTTP side. A request enters `server.js`, passes `express.json()` which fills `request.body`, reaches the first matching router, and the handler either sends a response or calls `next(error)`. The error middleware at the bottom of the stack turns the error object into a status code and a JSON body. When that is the only place writing errors, every route answers in the same shape.

The order of `app.use` calls matters. Body parsing comes before routers, routers come before the 404 handler, and the error middleware comes last with four parameters. Express picks a middleware by arity, so an error handler with three parameters is treated as a normal one and never runs.

## Every part

### Project layout

```js
// booking-api/
//   package.json          type: module, scripts: start, dev
//   .env                  DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT
//   db.js                 one Knex instance for the whole process
//   server.js             express app, routers, 404, error handler
//   lib/http-error.js     HttpError class with a status
//   lib/validate.js       text(), integer(), date()
//   middleware/error.js   404 handler and error handler
//   routers/hotels.js     list, filter, one, create
//   routers/bookings.js   by hotel, search, date range, create, partial update
//   routers/customers.js  list, one, create
```

Keep the database instance in its own module. Every router imports the same object, so the pool is created once and closed once. Creating `knex()` inside a handler opens a new pool per request and exhausts MySQL connections after a few minutes of load.

### The connection

```js
// db.js
import knex from 'knex';
import 'dotenv/config';

export const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'bookings',
        // DATE columns arrive as "2026-07-01" strings. Without this mysql2
        // builds a Date object and a timezone shift can move the day.
        dateStrings: true,
    },
    pool: { min: 0, max: 10 },
});
```

`dateStrings: true` is the line that saves an exam. A booking that starts on 2026-07-01 must come back as `2026-07-01`, not as `2026-06-30T22:00:00.000Z`. Once dates are strings in ISO form, comparing them with `<` and `>` in JavaScript is safe, and MySQL compares them correctly as `DATE` values.

The pool size is a promise to MySQL. Ten connections per process is plenty for an exam and for a small deployment. A pool of one hundred with four app instances means four hundred connections, and the server refuses new ones.

### The schema

```js
// schema.sql. Run once with the mysql client before the API starts.
const schema = `
CREATE TABLE customers (
    email VARCHAR(120) PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    birthday DATE NULL,
    image VARCHAR(255) NULL
) ENGINE = InnoDB;

CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(80) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    stars TINYINT NOT NULL,
    image VARCHAR(255) NULL,
    owner_email VARCHAR(120) NOT NULL,
    CONSTRAINT fk_hotel_owner FOREIGN KEY (owner_email)
        REFERENCES customers (email)
) ENGINE = InnoDB;

CREATE TABLE bookings (
    customer_email VARCHAR(120) NOT NULL,
    hotel_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    adults TINYINT NOT NULL DEFAULT 1,
    children TINYINT NOT NULL DEFAULT 0,
    boylovers TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (customer_email, hotel_id),
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_email)
        REFERENCES customers (email),
    CONSTRAINT fk_booking_hotel FOREIGN KEY (hotel_id)
        REFERENCES hotels (id),
    CONSTRAINT chk_booking_dates CHECK (start_date <= end_date)
) ENGINE = InnoDB;
`;
```

The bookings table has no `id`. A booking is identified by the pair `customer_email` and `hotel_id`, which means one customer can book one hotel once. That is the schema the exam uses, and it changes the update route: the `WHERE` clause needs both columns, and `affectedRows` tells you whether anything matched.

Foreign keys are not decoration. They reject a booking for an email that does not exist with error `ER_NO_REFERENCED_ROW_2`, and they refuse to delete a customer who still owns a booking with `ER_ROW_IS_REFERENCED_2`. Map both to 4xx responses instead of letting them become 500s.

### Routers

```js
// routers/hotels.js
import { Router } from 'express';
import { db } from '../db.js';
import { HttpError } from '../lib/http-error.js';
import { integer, text } from '../lib/validate.js';

const router = Router();

// GET /api/hotels?city=Eger&min_stars=3
router.get('/hotels', async (request, response, next) => {
    try {
        const city = typeof request.query.city === 'string' ? request.query.city.trim() : '';
        const minStars = request.query.min_stars === undefined
            ? 0
            : integer(request.query.min_stars, 'min_stars', { min: 1, max: 5 });

        const query = db('hotels as h')
            .join('customers as c', 'c.email', 'h.owner_email')
            .select({
                id: 'h.id',
                city: 'h.city',
                name: 'h.name',
                stars: 'h.stars',
                owner_email: 'h.owner_email',
            })
            .orderBy('h.name', 'asc');

        if (city) query.where('h.city', city);
        if (minStars > 0) query.where('h.stars', '>=', minStars);

        response.json(await query);
    } catch (error) {
        next(error);
    }
});

export default router;
```

Two details in that route are worth copying. Query string values are always strings, so `min_stars` goes through `integer()` before it reaches SQL. And the builder is built first, then narrowed with `where` calls. Both produce the same SQL, but the second form keeps the optional filters in one place and makes each one easy to remove.

The router exports only the router. `server.js` decides the mount path, so the same router can sit under `/api` in production and under `/api/v2` in a test without editing the route file.

### Validation

```js
// lib/http-error.js
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

// lib/validate.js
import { HttpError } from './http-error.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function text(value, field, { min = 1, max = 255 } = {}) {
    if (typeof value !== 'string') throw new HttpError(400, `${field} must be a string`);
    const trimmed = value.trim();
    if (trimmed.length < min) throw new HttpError(400, `${field} is required`);
    if (trimmed.length > max) throw new HttpError(400, `${field} is too long`);
    return trimmed;
}

export function integer(value, field, { min = 0, max = 1000 } = {}) {
    // Number('') and Number(null) are both 0, so reject them by type first.
    const blank = value === null || value === '' ||
        typeof value === 'boolean' ||
        (typeof value === 'string' && value.trim() === '');
    const number = Number(value);
    if (blank || !Number.isInteger(number) || number < min || number > max) {
        throw new HttpError(400, `${field} must be an integer from ${min} to ${max}`);
    }
    return number;
}

export function date(value, field) {
    if (typeof value !== 'string' || !DATE.test(value)) {
        throw new HttpError(400, `${field} must look like YYYY-MM-DD`);
    }
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.toISOString().slice(0, 10) !== value) {
        throw new HttpError(400, `${field} is not a real date`);
    }
    return value;
}
```

The date check has two stages for a reason. The pattern rejects `01-07-2026` and `2026-7-1`. The round trip through `Date.UTC` rejects `2026-02-31`, which passes the pattern and would reach MySQL as an error. Storing dates as strings means the check also works the same way in every timezone.

Throw `HttpError` from anywhere in a handler and the shared middleware converts it. This keeps status codes out of the route body, and it means an early return is not needed before every check. The thrown error carries the field name, so the client sees `min_stars must be an integer from 1 to 5` instead of `Bad request`.

### Error handling

```js
// middleware/error.js
import { HttpError } from '../lib/http-error.js';

const MYSQL_STATUS = {
    ER_DUP_ENTRY: [409, 'That row already exists'],
    ER_NO_REFERENCED_ROW_2: [400, 'The customer or hotel does not exist'],
    ER_ROW_IS_REFERENCED_2: [409, 'Other rows still point at this row'],
};

export function notFound(request, response) {
    response.status(404).json({ error: 'Not found' });
}

export function errorHandler(error, request, response, next) {
    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({ error: 'Invalid JSON body' });
    }
    if (error instanceof HttpError) {
        return response.status(error.status).json({ error: error.message });
    }
    const mapped = MYSQL_STATUS[error.code];
    if (mapped) {
        return response.status(mapped[0]).json({ error: mapped[1] });
    }
    console.error(request.method, request.originalUrl, error);
    response.status(500).json({ error: 'Server error' });
}
```

`entity.parse.failed` comes from `express.json()` when the body is not valid JSON. Without that branch the client gets a 500 for a malformed body, which suggests the server is broken.

The `next` parameter in `errorHandler` is unused but required. Express counts parameters when it looks for an error handler, so removing it silently turns the handler into ordinary middleware and every error becomes a hanging request.

Internal errors get a log line and a generic message. A database error string can contain the SQL, the table names, or a connection string. The client does not need that, and the log does.

### When you need a transaction

```js
// POST /api/owners, behind routers/customers.js
router.post('/owners', async (request, response, next) => {
    try {
        const email = text(request.body.email, 'email', { max: 120 });
        const firstName = text(request.body.first_name, 'first_name', { max: 60 });
        const lastName = text(request.body.last_name, 'last_name', { max: 60 });
        const hotelName = text(request.body.name, 'name', { max: 120 });
        const hotelCity = text(request.body.city, 'city', { max: 80 });

        const result = await db.transaction(async (trx) => {
            await trx('customers').insert({
                email,
                first_name: firstName,
                last_name: lastName,
                phone: '',
            });
            const [hotelId] = await trx('hotels').insert({
                city: hotelCity,
                name: hotelName,
                description: '',
                stars: 3,
                owner_email: email,
            });
            return hotelId;
        });

        response.status(201).json({ hotel_id: result });
    } catch (error) {
        next(error);
    }
});
```

A transaction takes one connection from the pool and runs everything on it. Use `trx`, never `db`, inside the callback. Using `db` sends the statement on a different connection, outside the transaction, and a rollback leaves that row behind. The callback returning normally commits; a thrown error rolls back and the error reaches the catch.

## Examples

### Example 1: hotels with owner and booking count

```js
// GET /api/hotels
// Every hotel with its owner's name and how many bookings it has.
// Data shape:
// [ { id: 1, name: 'Egri Csillag', city: 'Eger', stars: 4,
//     owner_name: 'Anna Kovacs', bookings: 3 } ]
router.get('/hotels', async (request, response, next) => {
    try {
        const rows = await db('hotels as h')
            .join('customers as c', 'c.email', 'h.owner_email')
            // leftJoin keeps hotels that have no bookings yet. A plain join
            // would drop them, and COUNT would never see the zero.
            .leftJoin('bookings as b', 'b.hotel_id', 'h.id')
            .select(
                'h.id',
                'h.name',
                'h.city',
                'h.stars',
                // Alias inside the raw SQL so the result key is predictable.
                db.raw("CONCAT(c.first_name, ' ', c.last_name) AS owner_name"),
                db.raw('COUNT(b.customer_email) AS bookings')
            )
            .groupBy(
                'h.id', 'h.name', 'h.city', 'h.stars',
                'c.first_name', 'c.last_name'
            )
            .orderBy('h.name', 'asc');

        // Number() is a no-op when the driver already parsed the count, and it
        // keeps the JSON shape stable when it hands back a string instead.
        response.json(rows.map((row) => ({ ...row, bookings: Number(row.bookings) })));
    } catch (error) {
        next(error);
    }
});
```

The join direction is the whole example. `leftJoin` on bookings plus `COUNT(b.customer_email)` counts only real booking rows, so a hotel with none returns 0. Move that to `COUNT(*)` and the empty hotel returns 1, because the outer join produced one row of nulls.

`groupBy` lists every selected column that is not aggregated. MySQL can run with `ONLY_FULL_GROUP_BY` disabled and accept a shorter list, and the result is then arbitrary for the columns left out. Write the full list and the query works on any server, including one with the strict default.

### Example 2: search across three tables

```js
// GET /api/bookings/by-search/:search_word
// Data shape:
// [ { customer_email, first_name, last_name, hotel_id, hotel_name,
//     start_date, end_date, adults, children } ]
router.get('/bookings/by-search/:search_word', async (request, response, next) => {
    try {
        const word = text(request.params.search_word, 'search_word', { max: 80 });
        // % and _ are wildcards in LIKE. Escape them so a search for "50%"
        // looks for the characters, not for anything starting with 50.
        const like = `%${word.replace(/[\\%_]/g, '\\$&')}%`;

        const rows = await db('bookings as b')
            .join('customers as c', 'c.email', 'b.customer_email')
            .join('hotels as h', 'h.id', 'b.hotel_id')
            .select({
                customer_email: 'b.customer_email',
                first_name: 'c.first_name',
                last_name: 'c.last_name',
                hotel_id: 'b.hotel_id',
                hotel_name: 'h.name',
                start_date: 'b.start_date',
                end_date: 'b.end_date',
                adults: 'b.adults',
                children: 'b.children',
            })
            // The callback groups the ORs. Without it, a later .where() would
            // attach to the last OR and the filter would leak.
            .where((group) => {
                group
                    .where('c.first_name', 'like', like)
                    .orWhere('c.last_name', 'like', like)
                    .orWhereRaw("CONCAT(c.first_name, ' ', c.last_name) LIKE ?", [like])
                    .orWhere('h.name', 'like', like)
                    .orWhere('h.description', 'like', like);
            })
            .orderBy('b.start_date', 'asc')
            .limit(100);

        response.json(rows);
    } catch (error) {
        next(error);
    }
});
```

The grouped `where` is not cosmetic. Knex joins multiple `where` calls with `AND`, so a route that adds `.where('b.start_date', '>=', today)` after an ungrouped chain of `orWhere` calls produces `... OR h.description LIKE ? AND b.start_date >= ?`. That is `description OR (date AND ...)`, and old bookings slip through. Wrapping the ORs in a callback gives `(first OR last OR name OR description) AND date >= ?`.

The hard limit of 100 keeps a broad search from returning the whole table. A search word of one letter is legal and matches nearly everything. If the UI needs paging, add `limit` and `offset`, cap the limit at 100, and order by a unique column so pages do not repeat rows.

### Example 3: occupancy over a date range

```js
// GET /api/bookings/from/2026-07-01/to/2026-07-31
// Data shape:
// { from_date, to_date, adults: 14, children: 3, boylovers: 0, bookings: 6 }
router.get('/bookings/from/:from_date/to/:to_date', async (request, response, next) => {
    try {
        const fromDate = date(request.params.from_date, 'from_date');
        const toDate = date(request.params.to_date, 'to_date');
        if (fromDate > toDate) {
            throw new HttpError(400, 'from_date must be before or equal to to_date');
        }

        const totals = await db('bookings')
            // Two ranges overlap when each starts before the other ends.
            // Equality is included: a guest leaving on the 31st still counts
            // for a request that ends on the 31st.
            .where('start_date', '<=', toDate)
            .where('end_date', '>=', fromDate)
            .sum({
                adults: 'adults',
                children: 'children',
                boylovers: 'boylovers',
            })
            .count({ bookings: 'customer_email' })
            .first();

        // An aggregate over zero rows still returns one row, with null sums.
        response.json({
            from_date: fromDate,
            to_date: toDate,
            adults: Number(totals?.adults ?? 0),
            children: Number(totals?.children ?? 0),
            boylovers: Number(totals?.boylovers ?? 0),
            bookings: Number(totals?.bookings ?? 0),
        });
    } catch (error) {
        next(error);
    }
});
```

The overlap condition is the part students reverse. `start_date <= to_date AND end_date >= from_date` asks whether the booking touches the requested window at all. The wrong version, `start_date >= from_date AND end_date <= to_date`, counts only bookings fully inside the window and misses the long stay that covers it.

The result of `SUM` is a string or `null`, never a number, even when every row is an integer. `SUM` of a small integer column returns `DECIMAL`, and mysql2 gives `DECIMAL` back as text to keep the precision. `Number(totals?.adults ?? 0)` handles both cases. Skip the conversion and the JSON says `"adults": "14"`, which the frontend then concatenates.

### Example 4: partial update of a booking

```js
// PUT /api/booking
// Body shape: { customer_email, hotel_id, ...fields to change }
// Only the fields present in the body are written. Everything else stays.
const UPDATABLE = ['start_date', 'end_date', 'adults', 'children', 'boylovers'];

router.put('/booking', async (request, response, next) => {
    try {
        const body = request.body ?? {};
        const email = text(body.customer_email, 'customer_email', { max: 120 });
        const hotelId = integer(body.hotel_id, 'hotel_id', { min: 1 });

        const patch = {};
        for (const field of UPDATABLE) {
            if (Object.hasOwn(body, field)) patch[field] = body[field];
        }
        if (Object.keys(patch).length === 0) {
            throw new HttpError(400, 'Send at least one field to update');
        }

        if (Object.hasOwn(patch, 'start_date')) {
            patch.start_date = date(patch.start_date, 'start_date');
        }
        if (Object.hasOwn(patch, 'end_date')) {
            patch.end_date = date(patch.end_date, 'end_date');
        }
        for (const field of ['adults', 'children', 'boylovers']) {
            if (Object.hasOwn(patch, field)) {
                patch[field] = integer(patch[field], field, { min: 0, max: 50 });
            }
        }

        const current = await db('bookings')
            .where({ customer_email: email, hotel_id: hotelId })
            .first();
        if (!current) {
            throw new HttpError(404, 'Booking not found');
        }

        // A one sided update can still invert the range: keep the old end date
        // and change only the start. Compare the merged values, not the patch.
        const nextStart = patch.start_date ?? current.start_date;
        const nextEnd = patch.end_date ?? current.end_date;
        if (nextStart > nextEnd) {
            throw new HttpError(400, 'start_date must be before or equal to end_date');
        }

        await db('bookings')
            .where({ customer_email: email, hotel_id: hotelId })
            .update(patch);

        const updated = await db('bookings')
            .where({ customer_email: email, hotel_id: hotelId })
            .first();
        response.json(updated);
    } catch (error) {
        next(error);
    }
});
```

Three things make this route safe. The whitelist `UPDATABLE` stops a client from writing `customer_email` or `hotel_id` through the body, which would move the booking to another key and look like a new row. `Object.hasOwn` separates "field missing" from "field present with a falsy value", so `children: 0` is written and `children: undefined` is not. The merged date check catches the case where only one date changes and the pair becomes invalid.

Do not build an update from `request.body` directly. `db('bookings').update(request.body)` writes whatever the client sends, including columns you never meant to expose, and throws a MySQL error for unknown columns, which the client sees as a 500.

### Example 5: the whole API

```js
// ============================================================
// booking-api, complete
// Every file is separated by a header comment. Read top to bottom:
// connection, schema, validation, middleware, routers, server.
// Sample data is invented. Emails use example.test.
// ============================================================

// ------------------------------------------------------------
// db.js
// ------------------------------------------------------------
import knex from 'knex';
import 'dotenv/config';

export const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'bookings',
        dateStrings: true,
    },
    pool: { min: 0, max: 10 },
});

// ------------------------------------------------------------
// schema.sql, run once
//
// CREATE TABLE customers (
//     email VARCHAR(120) PRIMARY KEY,
//     first_name VARCHAR(60) NOT NULL,
//     last_name VARCHAR(60) NOT NULL,
//     phone VARCHAR(30) NOT NULL,
//     birthday DATE NULL,
//     image VARCHAR(255) NULL
// ) ENGINE = InnoDB;
//
// CREATE TABLE hotels (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     city VARCHAR(80) NOT NULL,
//     name VARCHAR(120) NOT NULL,
//     description TEXT NOT NULL,
//     stars TINYINT NOT NULL,
//     image VARCHAR(255) NULL,
//     owner_email VARCHAR(120) NOT NULL,
//     CONSTRAINT fk_hotel_owner FOREIGN KEY (owner_email)
//         REFERENCES customers (email)
// ) ENGINE = InnoDB;
//
// CREATE TABLE bookings (
//     customer_email VARCHAR(120) NOT NULL,
//     hotel_id INT NOT NULL,
//     start_date DATE NOT NULL,
//     end_date DATE NOT NULL,
//     adults TINYINT NOT NULL DEFAULT 1,
//     children TINYINT NOT NULL DEFAULT 0,
//     boylovers TINYINT NOT NULL DEFAULT 0,
//     PRIMARY KEY (customer_email, hotel_id),
//     CONSTRAINT fk_booking_customer FOREIGN KEY (customer_email)
//         REFERENCES customers (email),
//     CONSTRAINT fk_booking_hotel FOREIGN KEY (hotel_id)
//         REFERENCES hotels (id),
//     CONSTRAINT chk_booking_dates CHECK (start_date <= end_date)
// ) ENGINE = InnoDB;
//
// Seed rows used by the sample requests at the end:
// customers: kovacs.anna@example.test, szabo.peter@example.test
// hotels:    1 Egri Csillag, Eger, 4 stars, owner Anna
//            2 Balaton Nadas, Siofok, 3 stars, owner Peter
// ------------------------------------------------------------

// ------------------------------------------------------------
// lib/http-error.js
// ------------------------------------------------------------
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

// ------------------------------------------------------------
// lib/validate.js
// ------------------------------------------------------------
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function text(value, field, { min = 1, max = 255 } = {}) {
    if (typeof value !== 'string') {
        throw new HttpError(400, `${field} must be a string`);
    }
    const trimmed = value.trim();
    if (trimmed.length < min) {
        throw new HttpError(400, `${field} is required`);
    }
    if (trimmed.length > max) {
        throw new HttpError(400, `${field} is too long`);
    }
    return trimmed;
}

export function integer(value, field, { min = 0, max = 1000 } = {}) {
    // Number('') and Number(null) are both 0, so reject them by type first.
    const blank = value === null || value === '' ||
        typeof value === 'boolean' ||
        (typeof value === 'string' && value.trim() === '');
    const number = Number(value);
    if (blank || !Number.isInteger(number) || number < min || number > max) {
        throw new HttpError(400, `${field} must be an integer from ${min} to ${max}`);
    }
    return number;
}

export function date(value, field) {
    if (typeof value !== 'string' || !DATE.test(value)) {
        throw new HttpError(400, `${field} must look like YYYY-MM-DD`);
    }
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.toISOString().slice(0, 10) !== value) {
        throw new HttpError(400, `${field} is not a real date`);
    }
    return value;
}

// ------------------------------------------------------------
// middleware/error.js
// ------------------------------------------------------------
const MYSQL_STATUS = {
    ER_DUP_ENTRY: [409, 'That row already exists'],
    ER_NO_REFERENCED_ROW_2: [400, 'The customer or hotel does not exist'],
    ER_ROW_IS_REFERENCED_2: [409, 'Other rows still point at this row'],
    ECONNREFUSED: [503, 'Database is not reachable'],
};

export function notFound(request, response) {
    response.status(404).json({ error: 'Not found' });
}

// Four parameters. Express looks at arity to recognise an error handler.
export function errorHandler(error, request, response, next) {
    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({ error: 'Invalid JSON body' });
    }
    if (error instanceof HttpError) {
        return response.status(error.status).json({ error: error.message });
    }
    const mapped = MYSQL_STATUS[error.code];
    if (mapped) {
        return response.status(mapped[0]).json({ error: mapped[1] });
    }
    console.error(new Date().toISOString(), request.method, request.originalUrl, error);
    response.status(500).json({ error: 'Server error' });
}

// ------------------------------------------------------------
// routers/hotels.js
// ------------------------------------------------------------
import { Router } from 'express';

const hotels = Router();

// GET /api/hotels?city=Eger&min_stars=3
hotels.get('/hotels', async (request, response, next) => {
    try {
        const city = typeof request.query.city === 'string' ? request.query.city.trim() : '';
        const minStars = request.query.min_stars === undefined
            ? 0
            : integer(request.query.min_stars, 'min_stars', { min: 1, max: 5 });

        const query = db('hotels as h')
            .join('customers as c', 'c.email', 'h.owner_email')
            .select(
                'h.id',
                'h.city',
                'h.name',
                'h.description',
                'h.stars',
                'h.image',
                'h.owner_email',
                db.raw("CONCAT(c.first_name, ' ', c.last_name) AS owner_name")
            )
            .orderBy('h.name', 'asc');

        if (city) query.where('h.city', city);
        if (minStars > 0) query.where('h.stars', '>=', minStars);

        response.json(await query);
    } catch (error) {
        next(error);
    }
});

// GET /api/hotels/1
hotels.get('/hotels/:id', async (request, response, next) => {
    try {
        const id = integer(request.params.id, 'id', { min: 1 });
        const hotel = await db('hotels').where({ id }).first();
        if (!hotel) {
            throw new HttpError(404, 'Hotel not found');
        }
        response.json(hotel);
    } catch (error) {
        next(error);
    }
});

// POST /api/hotels
// Body: { city, name, description, stars, owner_email }
hotels.post('/hotels', async (request, response, next) => {
    try {
        const body = request.body ?? {};
        const row = {
            city: text(body.city, 'city', { max: 80 }),
            name: text(body.name, 'name', { max: 120 }),
            description: text(body.description, 'description', { max: 2000 }),
            stars: integer(body.stars, 'stars', { min: 1, max: 5 }),
            owner_email: text(body.owner_email, 'owner_email', { max: 120 }),
        };

        const [id] = await db('hotels').insert(row);
        response.status(201).json({ id, ...row });
    } catch (error) {
        next(error);
    }
});

// ------------------------------------------------------------
// routers/customers.js
// ------------------------------------------------------------
const customers = Router();

// GET /api/customers
// Each customer with the number of bookings they made.
customers.get('/customers', async (request, response, next) => {
    try {
        const rows = await db('customers as c')
            .leftJoin('bookings as b', 'b.customer_email', 'c.email')
            .select(
                'c.email',
                'c.first_name',
                'c.last_name',
                'c.phone',
                db.raw('COUNT(b.hotel_id) AS bookings')
            )
            .groupBy('c.email', 'c.first_name', 'c.last_name', 'c.phone')
            .orderBy('c.last_name', 'asc');

        response.json(rows.map((row) => ({ ...row, bookings: Number(row.bookings) })));
    } catch (error) {
        next(error);
    }
});

// GET /api/customers/:email
customers.get('/customers/:email', async (request, response, next) => {
    try {
        const email = text(request.params.email, 'email', { max: 120 });
        const customer = await db('customers').where({ email }).first();
        if (!customer) {
            throw new HttpError(404, 'Customer not found');
        }
        response.json(customer);
    } catch (error) {
        next(error);
    }
});

// POST /api/customers
// Body: { email, first_name, last_name, phone, birthday, image }
customers.post('/customers', async (request, response, next) => {
    try {
        const body = request.body ?? {};
        const row = {
            email: text(body.email, 'email', { max: 120 }),
            first_name: text(body.first_name, 'first_name', { max: 60 }),
            last_name: text(body.last_name, 'last_name', { max: 60 }),
            phone: text(body.phone, 'phone', { max: 30 }),
            birthday: body.birthday === undefined ? null : date(body.birthday, 'birthday'),
            image: body.image === undefined ? null : text(body.image, 'image', { max: 255 }),
        };

        await db('customers').insert(row);
        response.status(201).json(row);
    } catch (error) {
        next(error);
    }
});

// ------------------------------------------------------------
// routers/bookings.js
// ------------------------------------------------------------
const bookings = Router();

// GET /api/bookings/by-hotel/1
bookings.get('/bookings/by-hotel/:hotel_id', async (request, response, next) => {
    try {
        const hotelId = integer(request.params.hotel_id, 'hotel_id', { min: 1 });
        const rows = await db('bookings as b')
            .join('customers as c', 'c.email', 'b.customer_email')
            .where('b.hotel_id', hotelId)
            .select({
                customer_email: 'b.customer_email',
                first_name: 'c.first_name',
                last_name: 'c.last_name',
                start_date: 'b.start_date',
                end_date: 'b.end_date',
                adults: 'b.adults',
                children: 'b.children',
                boylovers: 'b.boylovers',
            })
            .orderBy('b.start_date', 'asc');

        response.json(rows);
    } catch (error) {
        next(error);
    }
});

// GET /api/bookings/by-search/anna
bookings.get('/bookings/by-search/:search_word', async (request, response, next) => {
    try {
        const word = text(request.params.search_word, 'search_word', { max: 80 });
        const like = `%${word.replace(/[\\%_]/g, '\\$&')}%`;

        const rows = await db('bookings as b')
            .join('customers as c', 'c.email', 'b.customer_email')
            .join('hotels as h', 'h.id', 'b.hotel_id')
            .where((group) => {
                group
                    .where('c.first_name', 'like', like)
                    .orWhere('c.last_name', 'like', like)
                    .orWhereRaw("CONCAT(c.first_name, ' ', c.last_name) LIKE ?", [like])
                    .orWhere('h.name', 'like', like)
                    .orWhere('h.description', 'like', like);
            })
            .select({
                customer_email: 'b.customer_email',
                first_name: 'c.first_name',
                last_name: 'c.last_name',
                hotel_id: 'b.hotel_id',
                hotel_name: 'h.name',
                start_date: 'b.start_date',
                end_date: 'b.end_date',
            })
            .orderBy('b.start_date', 'asc')
            .limit(100);

        response.json(rows);
    } catch (error) {
        next(error);
    }
});

// GET /api/bookings/from/2026-07-01/to/2026-07-31
bookings.get('/bookings/from/:from_date/to/:to_date', async (request, response, next) => {
    try {
        const fromDate = date(request.params.from_date, 'from_date');
        const toDate = date(request.params.to_date, 'to_date');
        if (fromDate > toDate) {
            throw new HttpError(400, 'from_date must be before or equal to to_date');
        }

        const totals = await db('bookings')
            .where('start_date', '<=', toDate)
            .where('end_date', '>=', fromDate)
            .sum({ adults: 'adults', children: 'children', boylovers: 'boylovers' })
            .count({ bookings: 'customer_email' })
            .first();

        response.json({
            from_date: fromDate,
            to_date: toDate,
            adults: Number(totals?.adults ?? 0),
            children: Number(totals?.children ?? 0),
            boylovers: Number(totals?.boylovers ?? 0),
            bookings: Number(totals?.bookings ?? 0),
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/booking
// Body: { customer_email, hotel_id, start_date, end_date, adults, children, boylovers }
bookings.post('/booking', async (request, response, next) => {
    try {
        const body = request.body ?? {};
        const startDate = date(body.start_date, 'start_date');
        const endDate = date(body.end_date, 'end_date');
        if (startDate > endDate) {
            throw new HttpError(400, 'start_date must be before or equal to end_date');
        }

        const row = {
            customer_email: text(body.customer_email, 'customer_email', { max: 120 }),
            hotel_id: integer(body.hotel_id, 'hotel_id', { min: 1 }),
            start_date: startDate,
            end_date: endDate,
            adults: body.adults === undefined ? 1 : integer(body.adults, 'adults', { min: 0, max: 50 }),
            children: body.children === undefined ? 0 : integer(body.children, 'children', { min: 0, max: 50 }),
            boylovers: body.boylovers === undefined ? 0 : integer(body.boylovers, 'boylovers', { min: 0, max: 50 }),
        };

        await db('bookings').insert(row);
        response.status(201).json(row);
    } catch (error) {
        next(error);
    }
});

// PUT /api/booking, partial update, full code in Example 4.
bookings.put('/booking', async (request, response, next) => {
    try {
        const body = request.body ?? {};
        const email = text(body.customer_email, 'customer_email', { max: 120 });
        const hotelId = integer(body.hotel_id, 'hotel_id', { min: 1 });

        const patch = {};
        for (const field of ['start_date', 'end_date', 'adults', 'children', 'boylovers']) {
            if (Object.hasOwn(body, field)) patch[field] = body[field];
        }
        if (Object.keys(patch).length === 0) {
            throw new HttpError(400, 'Send at least one field to update');
        }

        if (Object.hasOwn(patch, 'start_date')) patch.start_date = date(patch.start_date, 'start_date');
        if (Object.hasOwn(patch, 'end_date')) patch.end_date = date(patch.end_date, 'end_date');
        for (const field of ['adults', 'children', 'boylovers']) {
            if (Object.hasOwn(patch, field)) {
                patch[field] = integer(patch[field], field, { min: 0, max: 50 });
            }
        }

        const key = { customer_email: email, hotel_id: hotelId };
        const current = await db('bookings').where(key).first();
        if (!current) {
            throw new HttpError(404, 'Booking not found');
        }

        if ((patch.start_date ?? current.start_date) > (patch.end_date ?? current.end_date)) {
            throw new HttpError(400, 'start_date must be before or equal to end_date');
        }

        await db('bookings').where(key).update(patch);
        response.json(await db('bookings').where(key).first());
    } catch (error) {
        next(error);
    }
});

// DELETE /api/booking
// Body: { customer_email, hotel_id }. A booking has no id of its own.
bookings.delete('/booking', async (request, response, next) => {
    try {
        const body = request.body ?? {};
        const email = text(body.customer_email, 'customer_email', { max: 120 });
        const hotelId = integer(body.hotel_id, 'hotel_id', { min: 1 });

        const deleted = await db('bookings')
            .where({ customer_email: email, hotel_id: hotelId })
            .del();

        if (deleted === 0) {
            throw new HttpError(404, 'Booking not found');
        }
        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

// ------------------------------------------------------------
// server.js
// ------------------------------------------------------------
import express from 'express';

const app = express();
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (request, response) => {
    response.json({ ok: true });
});

app.use('/api', hotels);
app.use('/api', customers);
app.use('/api', bookings);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});

// Close the pool after the last request, not before. Without this a restart
// leaves connections open until MySQL times them out.
async function shutdown() {
    server.close(async () => {
        await db.destroy();
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// ------------------------------------------------------------
// Sample requests, copied from a terminal against the seed rows
// ------------------------------------------------------------
//
// curl http://localhost:3000/api/hotels
// curl "http://localhost:3000/api/hotels?city=Eger&min_stars=3"
// curl http://localhost:3000/api/hotels/1
//
// curl -X POST http://localhost:3000/api/hotels \
//   -H "Content-Type: application/json" \
//   -d '{"city":"Pecs","name":"Zsolnay Udvar","description":"Rooms above the old factory.","stars":4,"owner_email":"kovacs.anna@example.test"}'
//
// curl http://localhost:3000/api/bookings/by-hotel/1
// curl http://localhost:3000/api/bookings/by-search/anna
// curl http://localhost:3000/api/bookings/from/2026-07-01/to/2026-07-31
//
// curl -X POST http://localhost:3000/api/booking \
//   -H "Content-Type: application/json" \
//   -d '{"customer_email":"szabo.peter@example.test","hotel_id":1,"start_date":"2026-07-10","end_date":"2026-07-14","adults":2,"children":1,"boylovers":0}'
//
// curl -X PUT http://localhost:3000/api/booking \
//   -H "Content-Type: application/json" \
//   -d '{"customer_email":"szabo.peter@example.test","hotel_id":1,"adults":3}'
//
// curl -X DELETE http://localhost:3000/api/booking \
//   -H "Content-Type: application/json" \
//   -d '{"customer_email":"szabo.peter@example.test","hotel_id":1}'
```

## Common mistakes

- **Skipping `next(error)`.** An async handler that rejects without a catch leaves the request open until the client times out. Express 4 does not forward rejected promises to the error middleware. Express 5 does, and code written for 4 works in 5, so write the try/catch either way.
- **Creating `knex()` in a handler.** Every call builds a new pool. Move the instance to `db.js` and import it.
- **Passing `request.body` straight into `.update()` or `.insert()`.** A client can then write columns you never checked. Build the row from named fields.
- **Forgetting `await` on a query.** The handler sends `undefined` or an empty response, and the query still runs in the background. A rejected promise from it is unhandled.
- **Omitting `groupBy` columns.** With `ONLY_FULL_GROUP_BY` the query errors. Without it the values are arbitrary and the bug only appears on a larger data set.
- **Using `join` where `leftJoin` belongs.** Hotels with no bookings disappear from a list that is supposed to show all hotels.
- **Confusing `COUNT(*)` with `COUNT(column)` after a left join.** The row of nulls counts as one. Count a column from the joined table.
- **Comparing dates as JavaScript `Date` objects without `dateStrings`.** The day shifts when the server timezone is not UTC and the client sees the previous day.
- **Trusting a DATE regex.** `2026-02-31` matches the pattern. Do the UTC round trip check as well.
- **Checking only the submitted date fields on partial update.** One new date plus the stored other date can invert the range. Merge first, then compare.
- **Returning aggregate results untyped.** `SUM` and `AVG` return `DECIMAL`, which mysql2 gives back as a string. `COUNT` may already be a number. Convert with `Number()` before sending JSON.
- **Using `db` inside a transaction callback.** The statement runs on another connection and survives a rollback. Use the `trx` argument everywhere inside.
- **Treating `first()` as an error when it returns `undefined`.** No row is a normal result. Check it and throw a 404 yourself.
- **Leaving the 404 handler after the error handler.** Order matters. The 404 catch all must come before the error middleware, and the error middleware must be last.
- **Logging the whole error to the client.** SQL fragments and connection strings leak. Log them on the server, send a short message.

## Exam checklist

- One `knex()` instance, in its own module, imported by every router.
- `express.json()` registered before the routers.
- Routers mounted under `/api`, each in its own file, exporting `Router()`.
- Every async handler has `try { ... } catch (error) { next(error); }`.
- Error middleware has four parameters and sits last; a 404 handler sits before it.
- MySQL error codes mapped: duplicate to 409, missing foreign row to 400, referenced row to 409.
- Request body fields validated for type, length, and range before any query.
- Update route uses a whitelist and `Object.hasOwn`, not the raw body.
- Update route verifies the row exists and returns 404 when it does not.
- Dates accepted as `YYYY-MM-DD`, checked for real calendar days, and ordered start before end.
- Date range route uses `start_date <= to AND end_date >= from`, with equality included.
- Search escapes `%` and `_`, groups its OR clauses in a callback, and has a limit.
- Joins use `leftJoin` when the parent row must survive without children.
- `groupBy` lists every selected non aggregated column.
- Aggregate values converted to numbers before `response.json`.
- Partial update merges stored values before comparing dates, then re-reads the row.
- Delete returns 204 on success and 404 when nothing matched.
- `dateStrings: true` set on the connection so DATE columns stay strings.
- `db.destroy()` called on shutdown.
- The SQL in the answer matches the schema: `customers(email)`, `hotels(id, owner_email)`, `bookings(customer_email, hotel_id)` as the composite key.

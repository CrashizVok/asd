# Knex queries and joins

Node.js topic · Exam Wiki

## Simplest form

```js
// Data shape: one plain object per row, one key per selected column
// hotels: [{ id: 1, name: 'Danube View', city: 'Budapest', stars: 4 }]
const hotels = await db('hotels')
  .select('id', 'name', 'city', 'stars')
  .where('city', 'Budapest')
  .orderBy('stars', 'desc')
  .limit(10);
```

## What it does

Every statement starts with a table name and grows through method calls. Knex keeps three pieces apart: the SQL text, the bound values, and the result handling. A finished builder is thenable, so `await` runs it once and gives you rows.

Reads resolve to an array of objects. Writes resolve to something else, and the difference matters in an exam. On MySQL an `insert` resolves to `[insertId]`, while `update` and `del` resolve to the number of affected rows.

The builder mutates as you call methods and returns itself. That is convenient in a chain and dangerous when you keep a base query around:

```js
const base = db('hotels');

base.where('city', 'Budapest');
// base now carries that where. The next caller inherits it.

const clean = db('hotels').clone();
clean.where('city', 'Debrecen');
// clone() is the cheap fix when you need one builder twice.
```

## Every part

### Reading rows

- `.select('id', 'name')` lists columns. `.select('*')` is fine for a toy query and wasteful in an API that returns JSON.
- `.select({ hotel: 'h.name', guest: 'c.first_name' })` renames a column in the result. Aliases are how you avoid two columns called `name`.
- `.where('stars', 4)` means equality. `.where('stars', '>=', 4)` is the three-argument form.
- `.where({ city: 'Budapest', stars: 4 })` combines conditions with `AND`.
- `.whereIn('id', [1, 2, 3])` builds `IN`. An empty array produces a condition that is always false, so you get zero rows instead of a SQL error.
- `.whereNull('phone')` and `.whereNotNull('phone')` compare against `NULL`. `where('phone', null)` produces `= NULL`, which is never true.
- `.whereBetween('start_date', ['2025-07-01', '2025-07-31'])` keeps both ends inclusive.
- `.where('name', 'like', '%view%')` binds the pattern as a value. The `%` stays a wildcard; a user who types `%` gets every row, so escape it when the input is free text.
- `.orWhere(...)` and grouped `.where(function () { this.where(...).orWhere(...) })` control precedence. Without the grouping function the `OR` escapes the surrounding conditions.
- `.orderBy('stars', 'desc')` sorts. Pass an array for a tie-breaker: `.orderBy([{ column: 'stars', order: 'desc' }, { column: 'name', order: 'asc' }])`.
- `.limit(10).offset(20)` is the MySQL `LIMIT 20, 10` pair. Offset pagination gets slower deep into a table, because MySQL still walks the skipped rows.
- `.first()` resolves to one row or `undefined`. `.first('name')` resolves to the value or `undefined`.
- `.pluck('name')` resolves to an array of values.
- `.count('* as total')` resolves to `[{ total: ... }]`. MySQL returns `COUNT` as `BIGINT`, which mysql2 can hand over as a string, so wrap it in `Number()`.
- `.countDistinct('customer_email as guests')` counts unique values. Without `distinct` a join multiplies rows and the count lies.

### Writing rows

- `.insert({ city: 'Eger', name: 'Hill House' })` inserts one row and resolves to `[insertId]`. Read `const [id] = await ...`.
- `.insert([{ ... }, { ... }])` inserts many rows in one statement. MySQL reports the id of the first inserted row only.
- `.update({ stars: 5 })` resolves to the number of affected rows. `.increment('stars', 1)` and `.decrement` do arithmetic inside the server, so two concurrent updates do not lose a step.
- `.del()` resolves to the number of deleted rows. `.truncate()` empties the table and resets the auto increment, and it cannot be rolled back.
- `.returning('id')` does nothing on MySQL. Knex prints a warning and ignores it; only PostgreSQL and MSSQL support it. For a new id read the insert result, and for updated rows run a `select` in the same transaction.
- `.onConflict().merge()` becomes `ON DUPLICATE KEY UPDATE`, which is MySQL's upsert. `.onConflict().ignore()` becomes `INSERT IGNORE`. Knex ignores the column list you pass on MySQL, so a unique key must already exist.
- `.forUpdate()` adds `SELECT ... FOR UPDATE`, which locks the matched rows until the transaction ends. It throws outside a transaction, because an autocommit statement releases the lock immediately.

### Joins

- `.join('customers as c', 'c.email', 'b.customer_email')` is the two-column form. Add the operator when it is not `=`: `.join('bookings as b', 'b.hotel_id', '=', 'h.id')`.
- `.leftJoin(...)` keeps hotels with no booking. The unmatched side arrives as `null`, so a filter on that side belongs in `where`, not in `on`, or the join turns into an inner join.
- `.join('customers as c', function () { this.on('c.email', 'b.customer_email').andOnVal('c.last_name', '!=', 'Test'); })` handles a join with more than one condition. `onVal` compares against a literal value.
- `.where('h.stars', '>=', 4)` filters on the joined table. Unqualified column names become ambiguous as soon as two tables share one, so qualify everything.
- `.groupBy('h.id').select('h.name').count('b.customer_email as guests')` aggregates per hotel. MySQL 8 runs with `ONLY_FULL_GROUP_BY`, which rejects selected columns that are neither grouped nor aggregated. List every plain column in `groupBy`.
- `.havingRaw('count(*) > ?', [1])` filters after grouping. `where` cannot see the aggregate.

### Transactions

```js
await db.transaction(async (trx) => {
  await trx('hotels').where('id', 1).update({ stars: 4 });
  await trx('bookings').insert({ customer_email: 'a@example.com', hotel_id: 1 });
});
// Resolving commits, throwing rolls back.
```

Every statement inside the callback must use `trx`. A plain `db(...)` inside the callback borrows a different socket and runs outside the transaction, which is the bug that survives testing and fails in production.

Nested `trx.transaction()` calls use savepoints. If you open a transaction manually with `const trx = await db.transaction()`, you must call `trx.commit()` or `trx.rollback()`, otherwise the socket stays checked out.

### Raw SQL

- `db.raw('select * from hotels where city = ?', ['Eger'])` binds values. On MySQL it resolves to `[rows, fields]`, so destructure the rows.
- `.whereRaw('LOWER(name) LIKE ?', [`%${term}%`])` is for expressions the builder cannot express.
- `.whereRaw('?? = ?', ['h.stars', 4])` uses `??` for identifiers. A `?` in a column position produces a quoted string, and MySQL compares a column to a string literal, which is not the same thing.
- `.orderByRaw('FIELD(city, ?, ?)', ['Budapest', 'Debrecen'])` sorts by a custom order.
- A table name or column name taken from a query string must be checked against a whitelist. Bindings cannot protect an identifier.

## SQL injection safety

Values are safe by construction: knex sends them as placeholders and mysql2 escapes them. Identifiers are not. Everything that reaches the SQL text as text is your responsibility.

```js
// Safe: the pattern is a bound value
db('hotels').where('name', 'like', `%${term}%`);

// Safe: whitelist decides the column name
const SORTABLE = new Set(['name', 'city', 'stars']);
const column = SORTABLE.has(req.query.sort) ? req.query.sort : 'name';
db('hotels').orderBy(column, 'asc');

// Unsafe: the value becomes SQL text
db.raw(`select * from hotels where name = '${term}'`);
db.raw(`select * from ${req.query.table}`);
```

`orderBy` and `select` accept a column name, not a value. Knex wraps identifiers in backticks, which stops some payloads and not others; a name such as `stars desc, (select ...)` can still change the query. The whitelist is the guard, not the quoting.

Multi-statement payloads (`'; drop table hotels; --`) need `multipleStatements: true` to work at all. mysql2 keeps it off by default. Do not turn it on.

## Examples

### Example 1: a filtered list with paging

```js
// GET /api/hotels?city=Budapest&minStars=3&sort=stars&page=2
import db from './db.js';

export async function listHotels({ city, minStars, sort = 'name', page = 1, perPage = 10 }) {
  const SORTABLE = new Set(['name', 'city', 'stars']);
  const column = SORTABLE.has(sort) ? sort : 'name';
  const offset = (Math.max(1, page) - 1) * perPage;

  const query = db('hotels')
    .select('id', 'name', 'city', 'stars', 'image')
    .orderBy(column, 'asc')
    .limit(perPage)
    .offset(offset);

  // Conditions go on this builder. The count below starts from a fresh
  // one, because limit on a count query would cap the total at 10.
  if (city) query.where('city', city);
  if (minStars) query.where('stars', '>=', minStars);

  const rows = await query;
  const [{ total }] = await db('hotels')
    .count('* as total')
    .modify((builder) => {
      if (city) builder.where('city', city);
      if (minStars) builder.where('stars', '>=', minStars);
    });

  return { rows, total: Number(total), page, perPage };
}
```

`.modify()` is the clean way to share a condition set between two builders without cloning a half-built query.

### Example 2: insert, update, delete, and what each returns

```js
// Each write reports something different. Printing the raw result once
// is worth more than memorising the docs.
const [newId] = await db('hotels').insert({
  city: 'Eger',
  name: 'Hill House',
  description: 'Six rooms above a bakery.',
  stars: 3,
  owner_email: 'anna.kovacs@example.com',
  image: null,
});
console.log(newId); // 4, the auto increment value

// MySQL counts changed rows, not matched rows. Sending the same values
// again reports 0 even though the row exists.
const changed = await db('hotels').where('id', newId).update({ stars: 4 });
console.log(changed); // 1

// A read is the portable way to see the row you just wrote.
const saved = await db('hotels').where('id', newId).first();
console.log(saved.stars); // 4

const removed = await db('hotels').where('id', newId).del();
console.log(removed); // 1
```

### Example 3: an upsert that survives a repeated request

```js
// A guest can book one hotel once, so (customer_email, hotel_id) is the
// primary key. A second POST updates the dates instead of failing.
await db('bookings')
  .insert({
    customer_email: 'ben.nagy@example.com',
    hotel_id: 1,
    start_date: '2025-09-01',
    end_date: '2025-09-04',
    adults: 2,
    children: 0,
    boylovers: 0,
  })
  .onConflict()
  .merge(['start_date', 'end_date', 'adults', 'children', 'boylovers']);
// SQL: INSERT ... ON DUPLICATE KEY UPDATE start_date = VALUES(start_date), ...
```

### Example 4: joins, grouping, and a count

```js
// Every hotel with its owner and the number of bookings.
// leftJoin keeps hotels nobody booked, and count(b.customer_email)
// counts 0 for them because count ignores NULL.
const rows = await db('hotels as h')
  .join('customers as c', 'c.email', 'h.owner_email')
  .leftJoin('bookings as b', 'b.hotel_id', 'h.id')
  .select({
    hotel: 'h.name',
    city: 'h.city',
    stars: 'h.stars',
    owner: db.raw("concat(c.first_name, ' ', c.last_name)"),
    guests: db.raw('count(b.customer_email)'),
  })
  .groupBy('h.id', 'h.name', 'h.city', 'h.stars', 'c.first_name', 'c.last_name')
  .orderBy('guests', 'desc');

// rows: [{ hotel: 'Danube View', city: 'Budapest', owner: 'Anna Kovacs', guests: 2 }, ...]

// Bookings of one hotel, with the guest name and image the frontend needs.
const bookings = await db('bookings as b')
  .join('customers as c', 'c.email', 'b.customer_email')
  .where('b.hotel_id', 1)
  .select(
    'b.customer_email',
    'b.start_date',
    'b.end_date',
    'b.adults',
    'b.children',
    'b.boylovers',
    'c.first_name',
    'c.last_name',
    'c.image as customer_image'
  )
  .orderBy('b.start_date', 'asc');
```

### Example 5: a transaction that checks before it writes

```js
// Two guests must not take the last room. The check and the write share
// one transaction, and forUpdate locks the hotel row while it runs.
export async function book({ email, hotelId, start, end, adults = 1, children = 0 }) {
  return db.transaction(async (trx) => {
    const hotel = await trx('hotels').where('id', hotelId).forUpdate().first();
    if (!hotel) {
      // Throwing rolls the transaction back. The caller decides the status.
      throw Object.assign(new Error('Hotel not found'), { status: 404 });
    }

    const clash = await trx('bookings')
      .where('hotel_id', hotelId)
      .where('start_date', '<', end)
      .where('end_date', '>', start)
      .first();

    if (clash) {
      throw Object.assign(new Error('Those dates are taken'), { status: 409 });
    }

    await trx('bookings').insert({
      customer_email: email,
      hotel_id: hotelId,
      start_date: start,
      end_date: end,
      adults,
      children,
      boylovers: 0,
    });

    // The resolved value comes back from the await outside.
    return trx('bookings').where({ customer_email: email, hotel_id: hotelId }).first();
  });
}
```

### Example 6: error handling that maps MySQL codes to HTTP

```js
// HTTP status is a protocol decision, not a database one. The code is the
// only stable part of a mysql2 error: messages change between versions.
const STATUS_BY_CODE = {
  ER_DUP_ENTRY: 409,
  ER_NO_REFERENCED_ROW_2: 400,
  ER_ROW_IS_REFERENCED_2: 409,
  ER_DATA_TOO_LONG: 400,
  ER_TRUNCATED_WRONG_VALUE: 400,
  ER_LOCK_DEADLOCK: 503,
  ECONNREFUSED: 503,
  PROTOCOL_CONNECTION_LOST: 503,
};

export function toHttpError(error) {
  const status = STATUS_BY_CODE[error.code] ?? 500;

  // Log the SQL and the real message on the server, never in the response:
  // sqlMessage names tables and columns, which is a map for an attacker.
  console.error({ code: error.code, sql: error.sql, message: error.message });

  return {
    status,
    body: {
      error:
        status === 500
          ? 'Database error'
          : error.code === 'ER_DUP_ENTRY'
            ? 'That record already exists'
            : 'The request cannot be saved as sent',
    },
  };
}
```

A deadlock is worth one retry. Catch `ER_LOCK_DEADLOCK` around the transaction call, wait a few milliseconds, and run the whole callback again. Do not retry inside the transaction; it is already gone.

### Example 7: a repository file, top to bottom

```js
// repositories/hotels.js
// All SQL for hotels lives here. Routes call these functions and never
// touch knex directly, so a schema change has one place to land.
import db from '../db.js';

const COLUMNS = ['id', 'city', 'name', 'description', 'stars', 'owner_email', 'image'];
const SORTABLE = new Set(['name', 'city', 'stars']);

// List with filters and paging. Returns rows and the total for the pager.
export async function findHotels({ city, minStars, sort, page, perPage }) {
  const column = SORTABLE.has(sort) ? sort : 'name';
  const size = Math.min(Number(perPage) || 10, 50);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * size;

  // One function applies the filters to both builders, so the count and
  // the page can never drift apart.
  const applyFilters = (builder) => {
    if (city) builder.where('city', city);
    if (minStars) builder.where('stars', '>=', Number(minStars));
    return builder;
  };

  const rows = await applyFilters(db('hotels').select(COLUMNS))
    .orderBy(column, 'asc')
    .limit(size)
    .offset(offset);

  const [{ total }] = await applyFilters(db('hotels').count('* as total'));

  return { rows, total: Number(total), page: Number(page) || 1, perPage: size };
}

// One hotel with its owner, or undefined when the id is unknown.
export async function findHotelById(id) {
  return db('hotels as h')
    .join('customers as c', 'c.email', 'h.owner_email')
    .where('h.id', Number(id))
    .select('h.*', 'c.first_name as owner_first_name', 'c.last_name as owner_last_name')
    .first();
}

// Create and return the stored row. MySQL has no RETURNING, so the
// read after the write is a separate statement.
export async function createHotel(data) {
  const [id] = await db('hotels').insert({
    city: data.city,
    name: data.name,
    description: data.description ?? null,
    stars: data.stars ?? 0,
    owner_email: data.owner_email,
    image: data.image ?? null,
  });

  return findHotelById(id);
}

// Partial update. The column list is fixed, so a request body can never
// reach the SQL as an identifier.
export async function updateHotel(id, patch) {
  const allowed = ['city', 'name', 'description', 'stars', 'image', 'owner_email'];
  const changes = {};

  for (const key of allowed) {
    if (patch[key] !== undefined) changes[key] = patch[key];
  }

  if (Object.keys(changes).length === 0) return findHotelById(id);

  const affected = await db('hotels').where('id', Number(id)).update(changes);
  // 0 can mean "no such row" or "nothing changed". A read settles it.
  if (affected === 0) return findHotelById(id);

  return findHotelById(id);
}

// Delete a hotel. A foreign key with ON DELETE RESTRICT turns this into
// ER_ROW_IS_REFERENCED_2 while bookings still point at the row.
export async function deleteHotel(id) {
  const affected = await db('hotels').where('id', Number(id)).del();
  return affected > 0;
}

// Search across hotel name, city, and description. Three bound values,
// one statement, no string building.
export async function searchHotels(term, limit = 20) {
  const like = `%${term}%`;

  return db('hotels')
    .select(COLUMNS)
    .where('name', 'like', like)
    .orWhere('city', 'like', like)
    .orWhere('description', 'like', like)
    .orderBy('stars', 'desc')
    .limit(limit);
}
```

## Common mistakes

- Reusing one builder for two queries. The `where` from the first leaks into the second; use `.clone()` or a fresh `db(table)`.
- Counting with the paged builder. `count()` inherits `limit`, so a list of 10 reports a total of 10.
- Forgetting `await`. A builder is a thenable, not a result, and `rows.length` on it is `undefined`.
- Using `db(...)` inside a transaction callback. The write happens on another connection and survives the rollback.
- Expecting `.returning()` to work. MySQL ignores it, and the code that expects a returned row gets `undefined`.
- Comparing to `NULL` with `where('phone', null)`. Use `whereNull`.
- Mixing `and` and `or` without a grouping callback, then wondering why `OR` returns every hotel.
- Selecting a column that is not in `GROUP BY` on MySQL 8. The server rejects the query with `ER_WRONG_FIELD_WITH_GROUP`.
- Putting a filter on the right side of a `leftJoin` into `where`, which silently removes the unmatched rows the join was supposed to keep.
- Trusting an `update` count of 0 as proof that the row is gone. MySQL counts changed rows.
- Passing `req.query.sort` straight into `orderBy`. Identifiers are not bound values.
- Sending `error.sqlMessage` to the client. It reveals table and column names.
- Opening a transaction by hand and forgetting `commit()`, which leaves a connection checked out until the pool starves.

## Exam checklist

- Can you write a select with two filters, an order, and a limit without looking anything up?
- Do you know what an `insert` resolves to, and what `update` and `del` resolve to?
- Can you explain why `returning('id')` fails silently on MySQL and what you do instead?
- Does every query inside a transaction use `trx`?
- Can you write an inner join and a left join on the bookings schema, with qualified column names?
- Can you count bookings per hotel and explain why `groupBy` needs every plain selected column?
- Do you know why `count` returns a string sometimes, and where you convert it?
- Can you point at the one place in your code where an identifier from a request is accepted, and show the whitelist?
- Can you name the MySQL error code for a duplicate key, a broken foreign key, and a deadlock?
- Does `await db.destroy()` appear in every script and in the shutdown path?
- Can you say what happens if a query throws inside `db.transaction`?
- Is there a query in your project that builds SQL with a template literal, and can you remove it?


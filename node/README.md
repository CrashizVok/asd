# Node.js backend

A small Express API for the bookings exam task. It uses MySQL through `mysql2/promise` and returns JSON.

## Requirements

- Node.js 18 or newer
- MySQL 8 or MariaDB 10.4 or newer
- The `bookings` database from `../sql/schema.sql`

## Setup

```bash
cd node
cp .env.example .env
# edit .env and set DB_PASSWORD
npm install
npm start
```

Import the database first:

```bash
mysql -u root -p < ../sql/schema.sql
```

The server starts on `http://localhost:3000`. Check it:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/hotels
```

## Endpoints

| Method | URL | Body | Response |
|---|---|---|---|
| GET | `/api/hotels` | none | Hotels with owner name |
| GET | `/api/bookings/by-hotel/:hotel_id` | none | Bookings for one hotel |
| GET | `/api/bookings/by-search/:search_word` | none | Matching bookings |
| PUT | `/api/booking` | JSON | Updated booking |
| POST | `/api/customer` | JSON | New customer |
| POST | `/api/booking` | JSON | New booking |
| GET | `/api/bookings/from/:from_date/to/:to_date` | none | Guest totals |

### Test the endpoints

```bash
curl http://localhost:3000/api/hotels
curl http://localhost:3000/api/bookings/by-hotel/1
curl http://localhost:3000/api/bookings/by-search/sun

curl -X PUT http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{"customer_email":"jane.doe@example.com","hotel_id":1,"end_date":"2024-01-12"}'

curl -X POST http://localhost:3000/api/customer \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","first_name":"New","last_name":"Guest"}'

curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{"customer_email":"new@example.com","hotel_id":1,"start_date":"2026-02-16","end_date":"2026-02-18"}'

curl http://localhost:3000/api/bookings/from/2024-01-01/to/2024-12-31
```

## How the code is organised

```text
node/
  server.js          Express app, middleware, error handler
  db.js              MySQL connection pool
  routes/hotels.js   GET /hotels
  routes/bookings.js bookings, search, update, date range
  routes/customers.js POST /customer
```

## Common errors

**`ECONNREFUSED 127.0.0.1:3306`**
MySQL is not running, or the host or port in `.env` is wrong.

**`ER_BAD_DB_ERROR: Unknown database 'bookings'`**
The schema was not imported. Run `mysql -u root -p < ../sql/schema.sql`.

**`ER_NO_SUCH_TABLE`**
The database name is right but the tables are missing. Import the dump again.

**`ER_DUP_ENTRY`**
The customer email or the booking pair already exists. The API returns 409 for this.

**Dates shift by one day**
Set `dateStrings: true` in `db.js`, or send dates as `YYYY-MM-DD` strings. Do not let the driver turn them into `Date` objects.

**CORS error in the browser**
The template uses `app.use(cors())`. If you remove it, add the frontend origin or use the Vite proxy.

## Changing it for another task

1. Rename the routes and the SQL columns.
2. Keep the same shape: validate input, query with `?`, return JSON, pass errors to `next`.
3. Update the response field names to exactly match the task sheet. The frontend depends on them.

## Security notes

- Every query uses placeholders. Do not build SQL with template strings.
- The template returns 500 with a generic message. It does not leak the SQL error to the client.
- The update route allows only a fixed list of fields. A client cannot set `customer_email` or `hotel_id` through the body.

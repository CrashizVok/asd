# Express basics

Node.js topic · Exam Wiki

## Simplest form

```js
// Data shape: a handler receives (request, response) and writes exactly one answer.
import express from 'express';

const app = express();

app.get('/api/health', (request, response) => {
    response.json({ ok: true });
});

app.listen(3000, () => {
    console.log('http://localhost:3000/api/health');
});
```

Run it with `node server.js`. The process keeps running because `listen` holds the port open. Stop it with Ctrl+C.

## What it does

`express()` returns a function, not a server. You build a list of layers on that function, then `app.listen(port)` hands it to `http.createServer` and binds the port. `listen` returns the `http.Server` object, so the same object also answers `server.close()` if you need a clean shutdown in a test.

Node's own `http` module can serve the same request. The cost is that you write the routing by hand:

```js
// Node without Express. Every new route is another branch in one function.
import { createServer } from 'node:http';

const server = createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/api/health') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ ok: true }));
        return;
    }

    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000);
```

That branch grows with every endpoint, and the query string, the JSON body and the path placeholders all stay unparsed. Express gives you four things on top of this: path patterns, `req.params`, `req.query`, and `res.json`. The request and response objects are the same Node objects with extra helpers, which is why `response.end()` still works inside an Express handler.

## The request object

`req` carries what the client sent.

- `req.method` is `'GET'`, `'POST'` and so on.
- `req.path` is the part before the `?`. `req.originalUrl` keeps the query string.
- `req.params` holds the named parts of the path: `/api/hotels/:hotel_id` gives `{ hotel_id: '4' }`.
- `req.query` holds the parsed query string. Repeat a key and you get an array: `?tag=a&tag=b` gives `{ tag: ['a', 'b'] }`.
- `req.body` holds the parsed body. It is `undefined` until a body parser runs. This is the first thing students get wrong.
- `req.headers` is a plain object with lowercased keys, so `req.headers['content-type']`.
- `req.get('Content-Type')` is the case insensitive version.

Every value that arrives from the URL or the body is text or an object. `params.hotel_id` is `'4'`, not `4`. Compare it with a string or convert it on purpose, because `'4' === 4` is false and MySQL will happily accept either.

## The response object

A handler must send exactly one response. After the first send the socket is closed for that reply, and a second call throws `ERR_HTTP_HEADERS_SENT`.

`res.status(code)` sets the status and returns `res`, which is why `res.status(404).json(...)` reads as one sentence. Without `status`, the code is 200.

`res.json(value)` serialises with `JSON.stringify`, sets `Content-Type: application/json; charset=utf-8`, and ends the response. `res.send(value)` does the same for a string or a `Buffer`, and switches to JSON when the value is an object or an array. Prefer `json` for API answers: it states the intent and never guesses the type.

`res.sendStatus(204)` sends the code with the matching reason phrase as the body. Use `res.status(204).end()` when a body is not allowed at all.

Three more that appear in exam code:

- `res.sendFile(path)` sends a file from disk and needs an absolute path, usually built with `fileURLToPath(import.meta.url)`.
- `res.set('X-Total-Count', rows.length)` adds a header before the body goes out.
- `res.redirect('/api/hotels')` answers with 302 and a `Location` header.

## Routing

A route is a method plus a path plus one or more handlers. Express matches methods exactly and paths in registration order.

```js
app.get('/api/hotels', listHotels);
app.post('/api/hotels', createHotel);
app.put('/api/hotels/:hotel_id', updateHotel);
app.delete('/api/hotels/:hotel_id', deleteHotel);
app.all('/api/ping', ping);          // any method
```

Paths support placeholders and optional pieces:

- `:name` matches one segment and lands in `req.params`.
- `:name?` makes that segment optional.
- `*` matches the rest of the path.
- A regular expression works too, but the exam never needs it.

Order matters. `GET /api/hotels/search` and `GET /api/hotels/:hotel_id` are both one segment after `/api/hotels`, so whichever is registered first wins. Register the literal path before the placeholder.

`app.get(path, handler, handler)` runs the handlers in sequence and only the first one that sends a response finishes the request. That is route level middleware, and `next()` is what passes control along. `next('route')` skips to the next matching route instead.

## Routers

A router is a small Express application with no port. It keeps the hotels code in one file and the app file readable.

```js
// routes/hotels.js
import { Router } from 'express';

const router = Router();

router.get('/', (request, response) => {
    response.json([{ hotel_id: 1, name: 'Hotel Taurus', city: 'Eger' }]);
});

router.get('/:hotel_id', (request, response) => {
    response.json({ hotel_id: Number(request.params.hotel_id) });
});

export default router;
```

Mount it with a prefix: `app.use('/api/hotels', router)`. Inside the router the paths stay relative, so `router.get('/:hotel_id')` answers `GET /api/hotels/4`. `req.params` still contains `hotel_id`. A router mounted under a parameterised path keeps its parent params only with `Router({ mergeParams: true })`.

## Static files and CORS

`app.use(express.static('public'))` serves files from the `public` folder on disk. `GET /logo.png` reads `public/logo.png`. It handles GET and HEAD only, refuses paths that escape the folder, and serves `index.html` for `/` unless you pass `{ index: false }`. Mount it before the 404 handler, otherwise the 404 answers first.

A browser page on `http://localhost:5173` calling `http://localhost:3000` is a cross origin request. Without a header the browser blocks the response. `app.use(cors())` adds `Access-Control-Allow-Origin: *` to every answer and handles the `OPTIONS` preflight that a JSON `POST` triggers. `cors({ origin: 'http://localhost:5173' })` narrows it to one origin, which is the honest setting; the wildcard is a shortcut for the exam.

## Validation

Validation is ordinary code that runs before the database call. Check presence, type and range, then answer 400 with a readable message. Do not let a missing field reach MySQL: it becomes a confusing 500 with a driver error in the log.

```js
function requireFields(body, fields) {
    return fields.filter((field) => body[field] === undefined || body[field] === '');
}
```

Numbers still arrive as numbers when the client sends JSON with real numbers, and as strings when they come from a form. `Number(value)` plus `Number.isFinite` covers both, and `Number('')` is `0`, so test for the empty string first.

## Examples

### Example 1: a route with params, query and a status

```js
// GET /api/hotels?city=Eger&stars=4
import express from 'express';

const app = express();

const hotels = [
    { hotel_id: 1, name: 'Hotel Taurus', city: 'Eger', stars: 4 },
    { hotel_id: 2, name: 'Hotel Panorama', city: 'Eger', stars: 3 },
    { hotel_id: 3, name: 'Hotel Duna', city: 'Budapest', stars: 5 },
];

app.get('/api/hotels', (request, response) => {
    const { city, stars } = request.query;

    // Filters are optional, so start from the whole list and narrow it.
    let rows = hotels;
    if (city) rows = rows.filter((hotel) => hotel.city === city);
    if (stars) rows = rows.filter((hotel) => hotel.stars === Number(stars));

    response.json(rows);
});

app.get('/api/hotels/:hotel_id', (request, response) => {
    const id = Number(request.params.hotel_id);
    const hotel = hotels.find((row) => row.hotel_id === id);

    // A missing row is a 404, not an empty 200. The client has to tell them apart.
    if (!hotel) {
        return response.status(404).json({ error: 'Hotel not found' });
    }

    response.json(hotel);
});

app.listen(3000);
```

### Example 2: a POST that reads a JSON body

```js
// POST /api/customer  {"first_name":"Anna","last_name":"Kiss","phone":"+3612345678"}
import express from 'express';

const app = express();
app.use(express.json());   // without this line req.body is undefined

app.post('/api/customer', (request, response) => {
    const { first_name, last_name, phone } = request.body ?? {};
    const missing = ['first_name', 'last_name', 'phone'].filter((field) => !request.body?.[field]);

    if (missing.length > 0) {
        // 400 means the client sent something the server refuses to use.
        return response.status(400).json({ error: `Missing field: ${missing.join(', ')}` });
    }

    // The real code inserts into MySQL and returns the new id.
    const customer = { customer_id: 101, first_name, last_name, phone };
    response.status(201).json(customer);
});

app.listen(3000);
```

The `?? {}` guard is not decoration. A request with no body at all leaves `req.body` as `{}` with `express.json()`, but a request with the wrong `Content-Type` leaves it `undefined`, and destructuring `undefined` throws before your validation can answer 400.

### Example 3: one full app, read top to bottom

```js
// server.js
// A hotels and bookings API with a router, validation, a 404 and an error handler.
// Sections are in the order they must run.
import express, { Router } from 'express';
import cors from 'cors';

const app = express();

// 1. Cross origin headers first, so even an error answer carries them.
app.use(cors());

// 2. Body parsing before any route that reads req.body.
app.use(express.json());

// 3. A tiny request log. It calls next() so the request continues.
app.use((request, response, next) => {
    console.log(`${request.method} ${request.originalUrl}`);
    next();
});

// 4. A router keeps the hotel routes out of this file.
const hotelsRouter = Router();

// Data stands in for the MySQL table. Field names match the schema.
const hotels = [
    { hotel_id: 1, name: 'Hotel Taurus', city: 'Eger', stars: 4, owner_email: 'owner@example.com' },
    { hotel_id: 2, name: 'Hotel Duna', city: 'Budapest', stars: 5, owner_email: 'duna@example.com' },
];

// GET /api/hotels?city=Eger
hotelsRouter.get('/', (request, response) => {
    const { city } = request.query;
    const rows = city ? hotels.filter((hotel) => hotel.city === city) : hotels;
    response.json(rows);
});

// GET /api/hotels/1
hotelsRouter.get('/:hotel_id', (request, response) => {
    const id = Number(request.params.hotel_id);

    // Number('abc') is NaN, so a non numeric id is a client mistake, not a miss.
    if (!Number.isInteger(id)) {
        return response.status(400).json({ error: 'hotel_id must be a number' });
    }

    const hotel = hotels.find((row) => row.hotel_id === id);
    if (!hotel) {
        return response.status(404).json({ error: 'Hotel not found' });
    }

    response.json(hotel);
});

// POST /api/hotels  with a JSON body
hotelsRouter.post('/', (request, response) => {
    const { name, city, stars, owner_email } = request.body ?? {};

    if (!name || !city || !owner_email) {
        return response.status(400).json({ error: 'name, city and owner_email are required' });
    }
    if (stars !== undefined && !(Number(stars) >= 1 && Number(stars) <= 5)) {
        return response.status(400).json({ error: 'stars must be between 1 and 5' });
    }

    const hotel = {
        hotel_id: hotels.length + 1,
        name,
        city,
        stars: Number(stars) || 3,
        owner_email,
    };
    hotels.push(hotel);

    // 201 plus the created row is the answer a client can use.
    response.status(201).json(hotel);
});

// 5. Mount the router. One prefix, relative paths inside.
app.use('/api/hotels', hotelsRouter);

// 6. A route that answers with text instead of JSON.
app.get('/api/health', (request, response) => {
    response.type('text/plain').send('ok');
});

// 7. Nothing matched above, so the path does not exist.
app.use((request, response) => {
    response.status(404).json({ error: 'Not found' });
});

// 8. Four arguments mark an error handler. It runs only when a handler called
//    next(error) or threw. Express 4 does not catch a rejected promise, so
//    async handlers need try/catch and next(error) themselves.
app.use((error, request, response, next) => {
    console.error(error.message);
    response.status(500).json({ error: 'Server error' });
});

app.listen(3000, () => {
    console.log('API on http://localhost:3000');
});
```

## Common mistakes

- Reading `req.body` without `app.use(express.json())`. The parser has to be registered before the route, and the client has to send `Content-Type: application/json`.
- Putting the 404 handler before the routes. Then every request gets 404 because that middleware matches everything and ends the response.
- Writing an error handler with three arguments. Express counts the parameters to decide whether a middleware is an error handler, so `(error, request, response)` never fires.
- Sending twice: `res.json(a); res.json(b);`. Put `return` in front of the first one inside an `if`.
- Comparing `request.params.hotel_id === 1`. Params are strings, so the comparison fails and the row is always missing.
- Assuming `req.query.stars` is a number. It is a string, or an array when the key repeats.
- Registering `/api/hotels/:hotel_id` before `/api/hotels/search`, so the search request is read as an id.
- Forgetting that `app.listen` is the last line. Anything registered after it still works, but a route added after `listen` in a start script that awaits something else can surprise you.
- Leaving the wildcard CORS header in a real app. It is fine for the exam, it is wrong for anything with a login.

## Exam checklist

- Can you start a server with `express()` and `app.listen(port)` and explain what `listen` returns?
- Can you write one route for each of GET, POST, PUT, DELETE and say which one uses `req.body`?
- Can you read a path parameter, a query parameter and a JSON body in the same handler and say what type each one has?
- Do you know the difference between `res.send`, `res.json` and `res.status(...)` chained in front of them?
- Can you move routes into a `Router`, mount it with a prefix, and keep the paths inside relative?
- Can you name the moment `req.body` becomes `undefined` and the one line that prevents it?
- Can you write a 404 handler and an error handler and say why their argument counts differ?
- Can you list the answer codes 200, 201, 204, 400 and 404 with one correct use for each?
- Can you explain why the server needs CORS for the React dev server and what header answers it?


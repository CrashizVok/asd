---
id: node-middleware
lang: Node.js
title: Middleware and errors
---

# Middleware and errors

## Simplest form

```js
// Data shape: (request, response, next) runs, then calls next(), or answers.
function logger(request, response, next) {
    console.log(`${request.method} ${request.path}`);
    next();   // leave this line out and the request hangs
}

app.use(logger);
```

## What it does

A middleware is a function that sits between the socket and the route. Express keeps every `use`, `get`, `post` in one ordered list. A request walks that list from the top, taking the first layer whose path and method match, running its function, and then either answering or calling `next()` to continue from the following layer.

That is the whole model. There is no separate router tree, only an ordered list, and an index that moves forward. Once you accept it, ordering bugs stop being mysterious.

Nothing runs the chain for you except the chain itself. If a middleware neither sends a response nor calls `next()`, the browser waits until it times out. That is the most common middleware bug in student code, and it looks like a slow server.

## The next function

`next()` continues with the next matching layer. It is not "finish"; it is "I am done, keep going". Called inside the last route it reaches Express's final handler, which answers 404 for you if nothing sent a body.

`next(error)` skips every normal middleware and route from that point and jumps to the first error handler. The argument must be an `Error`. Passing a string works in older code but you lose the stack.

`next('route')` skips the remaining handlers of the current route and tries the next matching route. It only works inside a route handler, not inside `app.use`.

Because the chain is a list, calling `next()` twice runs the rest of the list twice, and Express warns about it in newer versions. Return after a send:

```js
app.use((request, response, next) => {
    if (!request.headers.authorization) {
        return next(new Error('Missing Authorization header'));
    }
    next();
});
```

The `return` is cosmetic, since `next` does not continue the function. It stops the next line from running after you already decided to fail.

## Where middleware goes

`app.use(fn)` matches every method and every path. `app.use('/api', fn)` matches `/api` and everything under it, and strips that prefix before comparing, so a route inside a mounted router sees the short path.

Route level middleware is the same function passed as an extra argument:

```js
app.get('/api/hotels', requireAuth, validateQuery, listHotels);
```

This form is preferable when only one route needs the check, because nothing else has to know about it.

Order rules that cover most exam cases:

1. `cors()` first, so preflight and error answers carry the headers.
2. Body parsers next, before any handler reads `req.body`.
3. Logging and auth after parsing, before routes.
4. `express.static` before the 404.
5. Routes in their intended priority, literal paths before placeholders.
6. The 404 handler after every route.
7. The error handler last, with four parameters.

## Built in middleware

- `express.json()` parses `application/json` into `req.body`. A malformed body does not throw inside the parser's caller; it calls `next(error)` with `error.type === 'entity.parse.failed'`, which is why the error handler can answer 400 instead of 500.
- `express.urlencoded({ extended: false })` parses `application/x-www-form-urlencoded`, the body a plain HTML form posts.
- `express.static(root)` serves files from a directory, GET and HEAD only. It calls `next()` when the file is missing, so a route or the 404 can still answer.
- `express.Router()` is middleware in the sense that you mount it with `use`. Inside it the same ordering rules apply.

Both parsers ignore a request whose `Content-Type` does not match, and leave `req.body` as `{}`. A missing body and an unparsed body look identical afterwards.

## Error middleware

Four parameters, in this order:

```js
app.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).json({ error: 'Server error' });
});
```

Express counts the declared parameters. Three arguments makes it a normal middleware that never runs on an error; five makes it still an error handler, with `next` available to pass the error on.

The error handler must be registered after the routes, because the chain only moves forward. An error raised in a route cannot reach a handler registered above it.

Inside an error handler the response may already be half sent. Check `response.headersSent` before writing:

```js
app.use((error, request, response, next) => {
    if (response.headersSent) {
        return next(error);   // Express closes the connection for you
    }

    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({ error: 'Invalid JSON body' });
    }

    response.status(error.status ?? 500).json({ error: error.message ?? 'Server error' });
});
```

## Async handlers and rejected promises

In Express 4 a route that is `async` and rejects does not reach the error handler by itself. The promise rejection is unhandled, the request hangs, and Node prints a warning. Two fixes exist: wrap the body in `try/catch` and call `next(error)`, or wrap the handler once:

```js
// Express 5 forwards a rejected promise on its own. In Express 4 use this wrapper.
const wrap = (handler) => (request, response, next) =>
    Promise.resolve(handler(request, response, next)).catch(next);
```

The exam template in this repository uses the explicit `try/catch` inside each route, which reads well in an exam answer because the reader sees where the error goes.

## Validation as middleware

A validation check used on several routes belongs in a factory. The factory returns the middleware, so the route line stays short and the messages stay in one place.

```js
function requireBody(...fields) {
    return (request, response, next) => {
        const body = request.body ?? {};
        const missing = fields.filter((field) => body[field] === undefined || body[field] === '');

        if (missing.length > 0) {
            // 400 stops the chain here. The route below never runs.
            return response.status(400).json({ error: `Missing: ${missing.join(', ')}` });
        }
        next();
    };
}

app.post('/api/customer', requireBody('first_name', 'last_name', 'phone'), createCustomer);
```

## Examples

### Example 1: order decides the outcome

```js
import express from 'express';

const app = express();

app.use((request, response, next) => {
    console.log('first');
    next();
});

app.get('/api/health', (request, response) => {
    console.log('route');
    response.json({ ok: true });
});

app.use((request, response, next) => {
    console.log('second');
    next();
});

// GET /api/health prints: first, route
// The third middleware never runs, because the route ended the response
// before the chain reached it. next() would have carried on to it.
app.listen(3000);
```

### Example 2: an auth check, a validation check and a 404 in one chain

```js
// A tiny API with a fake token, a validated POST and the two closing layers.
import express from 'express';

const app = express();
app.use(express.json());

// 1. Every /api request needs the header. This is a stand in for a real check.
app.use('/api', (request, response, next) => {
    if (request.get('x-api-key') !== 'exam-key') {
        return response.status(401).json({ error: 'Invalid API key' });
    }
    next();
});

// 2. Only POST /api/booking needs a body, so the check stays on the route.
app.post(
    '/api/booking',
    (request, response, next) => {
        const { hotel_id, customer_email, start_date, end_date } = request.body ?? {};

        if (!hotel_id || !customer_email || !start_date || !end_date) {
            return response.status(400).json({ error: 'hotel_id, customer_email, start_date, end_date required' });
        }
        if (new Date(start_date) >= new Date(end_date)) {
            return response.status(400).json({ error: 'end_date must be after start_date' });
        }

        next();   // validated, hand over to the route
    },
    (request, response) => {
        const booking = { booking_id: 7, ...request.body };
        response.status(201).json(booking);
    }
);

// 3. Nothing matched.
app.use((request, response) => {
    response.status(404).json({ error: 'Not found' });
});

// 4. Any next(error) lands here.
app.use((error, request, response, next) => {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
});

app.listen(3000);
```

### Example 3: a complete server with every layer in place

```js
// server.js
// Ordering is the point of this file. Read the numbered blocks in order.
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ---- 1. Cross origin, before anything that can answer early ----------------
app.use(cors());

// ---- 2. Body parsers, before every route that reads req.body --------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---- 3. Request log. next() at the end, or every request stops here -------
app.use((request, response, next) => {
    const started = Date.now();
    response.on('finish', () => {
        // 'finish' fires after the answer is written, so the status is known.
        console.log(`${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - started}ms`);
    });
    next();
});

// ---- 4. Static files. A missing file calls next(), so the 404 still runs --
app.use(express.static(path.join(here, 'public')));

// ---- 5. One router with two routes and one local middleware --------------
const api = express.Router();

// A guard for this router only.
api.use((request, response, next) => {
    console.log('api router');
    next();
});

api.get('/hotels', (request, response) => {
    response.json([
        { hotel_id: 1, name: 'Hotel Taurus', city: 'Eger', stars: 4 },
        { hotel_id: 2, name: 'Hotel Duna', city: 'Budapest', stars: 5 },
    ]);
});

api.get('/hotels/:hotel_id', (request, response, next) => {
    const id = Number(request.params.hotel_id);

    if (!Number.isInteger(id) || id < 1) {
        // A bad id is a client error and does not need the error handler.
        return response.status(400).json({ error: 'hotel_id must be a positive integer' });
    }

    // Simulating a database failure: this is what next(error) is for.
    if (id === 99) {
        return next(new Error('Hotel 99 is missing from the table'));
    }

    response.json({ hotel_id: id, name: 'Hotel Taurus', city: 'Eger', stars: 4 });
});

app.use('/api', api);

// ---- 6. 404. app.use with no path matches every method and path ----------
app.use((request, response) => {
    response.status(404).json({ error: `No route for ${request.method} ${request.path}` });
});

// ---- 7. Error handler. Four parameters, last, after the 404 --------------
app.use((error, request, response, next) => {
    console.error(error.stack);

    if (response.headersSent) {
        // The answer already started, only Express can end it cleanly.
        return next(error);
    }
    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({ error: 'Invalid JSON body' });
    }

    response.status(500).json({ error: 'Server error' });
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
});
```

## Common mistakes

- A middleware without `next()` and without a response. The request hangs and the student blames the database.
- Registering `express.json()` after the routes. `req.body` stays `{}` in every handler.
- An error handler declared with `(error, request)` or with three parameters. Express will not call it; check the count first.
- An error handler placed above the routes, so nothing can reach it.
- The 404 middleware placed before the router. It matches everything and answers first.
- Calling `next()` after `response.json()`. The rest of the chain runs and tries to answer again.
- Throwing inside async code without `try/catch` in Express 4. The rejection escapes and the client waits.
- Using `express.static` after the 404. Files never get a chance to be served.
- Treating `next('route')` as an error path. It skips to the next route; errors go through `next(error)`.
- Returning a different shape from the error handler than from the routes, so the client has two parsers.

## Exam checklist

- Can you write a middleware signature from memory and say what happens when `next()` is missing?
- Can you explain the difference between `next()`, `next('route')` and `next(error)` in one sentence each?
- Can you place the seven layers of a server in the right order without notes?
- Do you know how Express recognises an error handler and why that handler must be last?
- Can you name the error type a broken JSON body produces and the status code you answer with?
- Can you mount the same middleware on every path, on a prefix, and on one route?
- Can you write a middleware factory that validates required body fields and answers 400?
- Can you explain why `express.static` calls `next()` on a missing file?
- Do you know what `response.headersSent` protects against inside an error handler?
- Can you describe what Express 4 does with a rejected async handler, and the two ways to fix it?

# req.body

Node.js command · Request

The parsed request body. It exists only after a body parser ran and the Content-Type matched.

## Syntax

```js
req.body
```

## Example

```js
app.use(express.json());   // required, and before the route

app.post('/api/customer', (request, response) => {
    const body = request.body ?? {};
    const { customer_email, first_name, last_name } = body;

    if (!customer_email || !first_name || !last_name) {
        return response.status(400).json({ error: 'customer_email, first_name, last_name required' });
    }

    response.status(201).json({ customer_id: 12, customer_email, first_name, last_name });
});
```

## Details

With `express.json()` and no body at all, `req.body` is `{}`. With a body but the wrong `Content-Type`, it is also `{}` in Express 4. Destructuring is safe in both cases; reading `.customer_email` off `undefined` is not, which is what the `?? {}` guard prevents.

Numbers keep their type when the client sends real JSON numbers: `{"adults": 2}` gives a number. A form post gives strings for everything, so convert.

Arrays are accepted too. Validate `Array.isArray(body.tags)` before mapping over them.

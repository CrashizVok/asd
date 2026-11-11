# res.status()

Node.js command · Response

Sets the HTTP status code and returns res, so it chains in front of json, send or end.

## Syntax

```js
res.status(code)
```

## Example

```js
app.post('/api/customer', (request, response) => {
    if (!request.body?.customer_email) {
        return response.status(400).json({ error: 'customer_email is required' });
    }

    response.status(201).json({ customer_id: 7, customer_email: request.body.customer_email });
});

app.get('/api/hotels/:hotel_id', (request, response) => {
    response.status(404).json({ error: 'Hotel not found' });
});
```

## Details

Codes that appear in exam answers: 200 default success, 201 created, 204 no content, 400 bad input, 401 missing or wrong credentials, 404 no such row or path, 409 conflict, 500 unexpected server failure.

`res.sendStatus(code)` sets the code and sends the reason phrase as text, which is convenient for 204 and wrong for JSON APIs.

A status set but not sent has no effect until the body goes out. One response, one status.

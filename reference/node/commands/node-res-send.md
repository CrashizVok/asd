# res.send()

Node.js command · Response

Sends a string, Buffer, object or array and ends the response. It sets the Content-Type from the body type, and falls back to JSON for objects.

## Syntax

```js
res.send(body)
```

## Example

```js
app.get('/api/health', (request, response) => {
    response.type('text/plain').send('ok');   // Content-Type: text/plain
});

app.get('/api/hotels', (request, response) => {
    // An object here is serialised as JSON, same as res.json.
    response.send([{ hotel_id: 1, name: 'Hotel Taurus' }]);
});
```

## Details

`send` guesses the type. A string becomes `text/html` by default, which is wrong for an API answer, so set it with `res.type('text/plain')` or use `res.json`.

The type guess is why `res.json` is the safer habit: one intent, one header, no guessing.

`send` with a number is treated as a status code in old Express 3 code. In Express 4 and 5 `res.send(404)` sends the text `404`. Set the status with `res.status`.

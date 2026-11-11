# res.json()

Node.js command · Response

Serialises the value, sets Content-Type: application/json, and ends the response.

## Syntax

```js
res.json(value)
```

## Example

```js
app.get('/api/hotels', (request, response) => {
    response.json({ hotels: [], total: 0 });
});

app.get('/api/hotels/:hotel_id', (request, response) => {
    response.status(404).json({ error: 'Hotel not found' });
});
```

## Details

An object and an array both work. `undefined` does not: `res.json(undefined)` throws because there is nothing to serialise, so guard the lookup before answering.

The method ends the response, so anything after it is dead code unless it is in a different branch. Return from the branch:

```js
if (!row) return response.status(404).json({ error: 'Not found' });
response.json(row);
```

A `Date` inside the value becomes an ISO string. A `BigInt` throws `TypeError: Do not know how to serialize a BigInt`, which happens with MySQL `COUNT(*)` when the driver is set to return big numbers.

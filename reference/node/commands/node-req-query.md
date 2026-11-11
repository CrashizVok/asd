# req.query

Node.js command · Request

The parsed query string as an object. Every value is a string, or an array of strings when the key repeats.

## Syntax

```js
req.query.key
```

## Example

```js
// GET /api/bookings?city=Eger&adults=2&tag=a&tag=b
app.get('/api/bookings', (request, response) => {
    const { city, adults, tag } = request.query;

    // ?tag=a&tag=b gives tag = ['a', 'b']
    const tags = Array.isArray(tag) ? tag : tag ? [tag] : [];

    response.json({
        city: city ?? null,
        adults: adults ? Number(adults) : null,
        tags,
    });
});
```

## Details

An absent key is `undefined`, a key with no value is `''`, and a repeated key is an array. Those three cases are the source of most filter bugs.

`?stars=4` arrives as `'4'`. `Number(stars)` for comparisons, and check `Number.isFinite` before trusting it, because `Number('abc')` is `NaN` and `NaN` fails every comparison silently.

Never paste query values into SQL. `pool.query('... WHERE city = ?', [city])` sends them as data; string concatenation turns them into code.

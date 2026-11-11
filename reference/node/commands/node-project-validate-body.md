# Whitelist request body fields

Node.js command · Validation

Copies only known fields out of the body and validates each one. Object.hasOwn tells a missing field apart from a falsy value such as 0.

## Syntax

```js
for (const field of FIELDS) if (Object.hasOwn(body, field)) row[field] = body[field]
```

## Example

```js
const UPDATABLE = ['start_date', 'end_date', 'adults', 'children', 'boylovers'];

const patch = {};
for (const field of UPDATABLE) {
    if (Object.hasOwn(request.body, field)) {
        patch[field] = request.body[field];
    }
}

if (Object.keys(patch).length === 0) {
    throw new HttpError(400, 'Send at least one field to update');
}

if (Object.hasOwn(patch, 'start_date')) {
    patch.start_date = date(patch.start_date, 'start_date');
}
if (Object.hasOwn(patch, 'adults')) {
    patch.adults = integer(patch.adults, 'adults', { min: 0, max: 50 });
}
```

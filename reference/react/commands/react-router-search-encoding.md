# search param encoding

React command · Hooks

URLSearchParams percent encodes on write and decodes on read, so accents, spaces and ampersands survive the round trip.

## Syntax

```jsx
new URLSearchParams(searchParams).set(key, value)
```

## Example

```jsx
const city = 'Békéscsaba & környéke';

setSearchParams({ city });
// URL: ?city=B%C3%A9k%C3%A9csaba+%26+k%C3%B6rny%C3%A9ke

searchParams.get('city');
// 'Békéscsaba & környéke' back again
```

## Details

Do not call `encodeURIComponent` before `setSearchParams` or before `new URLSearchParams`. The value is encoded twice, the server reads `%2526`, and the bug looks like a server problem.

A space is written as `+` in a query string and read back as a space, together with `%20`. That is form encoding and it is correct.

When building a fetch URL, use the same class:

```jsx
const query = new URLSearchParams({ city, stars });
fetch(`/api/hotels?${query}`);
```

Repeated keys come from `append`, not `set`, and are read with `getAll`.

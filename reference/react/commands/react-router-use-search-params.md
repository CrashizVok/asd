# useSearchParams()

React command · Hooks

Reads and writes the query string as URLSearchParams, so a filter survives a refresh and can be shared as a link.

## Syntax

```jsx
const [searchParams, setSearchParams] = useSearchParams();
```

## Example

```jsx
const [searchParams, setSearchParams] = useSearchParams();

const city = searchParams.get('city') ?? '';

// object form replaces the whole query string
setSearchParams({ city: 'Eger' });

// merge form, the safe one when other keys matter
const next = new URLSearchParams(searchParams);
if (city) next.set('city', city); else next.delete('city');
setSearchParams(next, { replace: true });
```

## Details

`get` returns `null` when the key is absent and `''` for `?city=`. `getAll` returns repeated keys, which is what a set of checkboxes produces.

Values are encoded on write and decoded on read, so an accented city or a value with `&` needs no `encodeURIComponent`.

The setter also accepts a function of the previous params, and `{ replace: true }` keeps a search box that fires on every keystroke out of the history stack.

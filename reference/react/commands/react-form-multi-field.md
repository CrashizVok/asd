# one state object

React command · Form state

One object holds every field and one handler writes by name. Cheaper than one useState per field once a form grows.

## Syntax

```jsx
setForm((prev) => ({ ...prev, [name]: value }))
```

## Example

```jsx
const EMPTY = { first_name: '', last_name: '', phone: '' };
const [form, setForm] = useState(EMPTY);

function handleChange(event) {
  const { name, type, value, checked } = event.target;
  setForm((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
}
```

## Details

The computed key needs `name` on every input. A field without `name` writes to the key `"undefined"` and nothing visible changes, which is hard to spot.

Add a checkbox group with its own handler, because it needs an array rather than a string. A nested object needs a spread at every level:

```jsx
setForm((prev) => ({
  ...prev,
  address: { ...prev.address, city: value },
}));
```

When the form gains add, remove and edit row actions, `useReducer` keeps the transitions in one place and is easier to read than five chained spreads.

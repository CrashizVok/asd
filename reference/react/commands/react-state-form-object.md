# form state as one object

React command · Forms

Keeps many fields in one object and updates them through each input's name attribute.

## Syntax

```jsx
setForm(f => ({ ...f, [event.target.name]: event.target.value }))
```

## Example

```jsx
// Data shape: { first_name, last_name, phone }
const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });

function handleChange(event) {
  const { name, value } = event.target;
  setForm(current => ({ ...current, [name]: value }));
}

return (
  <form>
    <input name="first_name" value={form.first_name} onChange={handleChange} />
    <input name="last_name" value={form.last_name} onChange={handleChange} />
    <input name="phone" value={form.phone} onChange={handleChange} />
  </form>
);
```

## Details

One handler for every field removes a row of near identical functions. The `name` attribute must match a key in the state object, and the key must already exist in the initial object.

This shape is the natural entry point for `useReducer`, because adding validation and a submit status to the same object quickly outgrows a single setter.

# setState({ ...state, field })

React command · State updates

Replaces a state object with a copy, because React state is not merged for you.

## Syntax

```jsx
setForm(current => ({ ...current, [field]: value }))
```

## Example

```jsx
// Data shape: { customer_email, first_name, last_name }
function CustomerForm() {
  const [form, setForm] = useState({ customer_email: '', first_name: '', last_name: '' });

  function setField(field, value) {
    // Spread the old object, then override one key.
    setForm(current => ({ ...current, [field]: value }));
  }

  return (
    <input
      value={form.first_name}
      onChange={e => setField('first_name', e.target.value)}
    />
  );
}
```

## Details

Unlike a class component's `setState`, the hook does not merge keys. `setForm({ first_name: 'Anna' })` drops the email and the last name.

The computed key `[field]` keeps one handler for many inputs. It is safe as long as the field name comes from your code, never from user input, and the field exists in the state shape.

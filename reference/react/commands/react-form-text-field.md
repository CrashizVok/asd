# controlled text input

React command · Forms

State holds the text, value displays it, onChange writes it back. Removing either half breaks the loop.

## Syntax

```jsx
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

## Example

```jsx
const [name, setName] = useState('');

<label htmlFor="name">Name</label>
<input
  id="name"
  name="name"
  value={name}
  onChange={(event) => setName(event.target.value)}
/>
```

## Details

The handler receives a React event. `event.target` is the DOM input, so `event.target.value` is the current text. Trim only when validating; stripping spaces in `onChange` moves the cursor while the user types.

For a form with several text fields, use one state object and one handler keyed by `name`:

```jsx
const [form, setForm] = useState({ first_name: '', last_name: '' });

function handleChange(event) {
  const { name, value } = event.target;
  setForm((prev) => ({ ...prev, [name]: value }));
}
```

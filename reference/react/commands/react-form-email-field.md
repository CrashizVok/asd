# email input

React command · Forms

An email field is a text field with type email. The browser checks the shape on submit, and your own check still runs.

## Syntax

```jsx
<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
```

## Example

```jsx
const [email, setEmail] = useState('');

<input
  type="email"
  name="customer_email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  autoComplete="email"
  required
/>
```

## Details

`type="email"` gives the right mobile keyboard and lets the browser reject an address with no `@`. That check is skipped when the form has `noValidate`, and it never runs when the value comes from state without a submit, so validate in code as well:

```jsx
const clean = email.trim();
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
  setError('Email looks incomplete.');
}
```

A trimmed value is the one to send. Keep the raw value in state so the user sees their own typing.

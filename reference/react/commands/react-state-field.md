# controlled field

React command · Forms

Binds an input to state so React is the single source of the displayed value.

## Syntax

```jsx
value={value} onChange={e => setValue(e.target.value)}
```

## Example

```jsx
function EmailField() {
  const [email, setEmail] = useState('');

  return (
    <label>
      customer_email
      <input
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
      />
      <span>{email.length} characters</span>
    </label>
  );
}
```

## Details

The input shows what the state says. Typing fires `onChange`, the handler stores the string, and the next render paints it back. Because the value flows from state, validation, formatting and reset all work in one place.

An input with `value` and no `onChange` is read-only and logs a warning. An input with `defaultValue` is uncontrolled, so state updates cannot change what it shows.

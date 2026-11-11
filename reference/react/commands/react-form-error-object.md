# field errors

React command · Validation

One errors object keyed by field name. Render each message under its field and mark the input invalid.

## Syntax

```jsx
{errors.customer_email && <p>{errors.customer_email}</p>}
```

## Example

```jsx
const [errors, setErrors] = useState({});

<input
  name="customer_email"
  value={form.customer_email}
  onChange={handleChange}
  aria-invalid={Boolean(errors.customer_email)}
  aria-describedby={errors.customer_email ? 'customer_email_error' : undefined}
/>
{errors.customer_email && (
  <p id="customer_email_error">{errors.customer_email}</p>
)}
```

## Details

`aria-invalid` tells assistive technology the field is wrong, and `aria-describedby` makes the message part of the field announcement. Without both, a screen reader user hears the label and the value but not the reason.

After a failed submit, move focus to the first invalid field. With a ref on the form this is a single query:

```jsx
const first = Object.keys(errors)[0];
formRef.current?.querySelector(`[name="${first}"]`)?.focus();
```

For long forms, an error summary at the top with the count of problems helps, but the per-field text is what people actually read.

# validate function

React command · Validation

A pure function from values to an errors object. Empty object means valid.

## Syntax

```jsx
function validate(form) { const errors = {}; return errors; }
```

## Example

```jsx
function validate(form) {
  const errors = {};
  const email = form.customer_email.trim();

  if (!email) errors.customer_email = 'Email is required.';
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.customer_email = 'Email looks incomplete.';
  }

  if (!form.first_name.trim()) errors.first_name = 'First name is required.';
  if (Number(form.adults) < 1) errors.adults = 'At least one adult.';

  return errors;
}

const found = validate(form);
const valid = Object.keys(found).length === 0;
```

## Details

Keeping validation outside the component makes it testable without rendering and keeps the submit handler short.

Three moments to run it: on submit always, on blur when a field is left, on change only after the first failed submit. The last one avoids shouting at someone who is halfway through typing.

Error text should say what to do. "Phone needs at least 7 digits" is useful; "Invalid input" is not. Validate for the user, then validate again on the server, because the browser and your state are both outside the database.
